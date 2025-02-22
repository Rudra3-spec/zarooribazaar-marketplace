import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Login attempt for username:", username); // Debug log
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          console.log("Login failed: Invalid credentials"); // Debug log
          return done(null, false);
        }
        console.log("Login successful for user:", user.id); // Debug log
        return done(null, user);
      } catch (error) {
        console.error("Login error:", error); // Debug log
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user.id); // Debug log
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      console.log("Deserializing user:", id); // Debug log
      const user = await storage.getUser(id);
      if (!user) {
        console.log("Deserialization failed: User not found"); // Debug log
        return done(new Error('User not found'));
      }
      console.log("Deserialization successful"); // Debug log
      done(null, user);
    } catch (error) {
      console.error("Deserialization error:", error); // Debug log
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      console.log("Registration attempt:", req.body.username); // Debug log
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        console.log("Registration failed: Username exists"); // Debug log
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      console.log("User registered successfully:", user.id); // Debug log
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error); // Debug log
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login request received"); // Debug log
    passport.authenticate("local", (err: Error | null, user?: Express.User) => {
      if (err) {
        console.error("Authentication error:", err); // Debug log
        return next(err);
      }
      if (!user) {
        console.log("Authentication failed: No user"); // Debug log
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err); // Debug log
          return next(err);
        }
        console.log("User logged in successfully:", user.id); // Debug log
        res.json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    const userId = req.user?.id;
    console.log("Logout request for user:", userId); // Debug log
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err); // Debug log
        return next(err);
      }
      console.log("User logged out successfully:", userId); // Debug log
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("Current user request. Authenticated:", req.isAuthenticated()); // Debug log
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    console.log("Returning user data for:", req.user?.id); // Debug log
    res.json(req.user);
  });
}