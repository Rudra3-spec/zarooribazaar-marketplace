import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/user/:userId", async (req, res) => {
    const products = await storage.getProductsByUser(parseInt(req.params.userId));
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const product = await storage.createProduct(parsed.data);
    res.status(201).json(product);
  });

  // Messages
  app.get("/api/messages", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const messages = await storage.getMessages(req.user.id);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const message = await storage.createMessage(parsed.data);
    res.status(201).json(message);
  });

  // Admin routes
  app.get("/api/users", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const users = Array.from((storage as any).users.values());
    res.json(users);
  });

  app.get("/api/messages/all", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const messages = Array.from((storage as any).messages.values());
    res.json(messages);
  });

  const httpServer = createServer(app);
  return httpServer;
}