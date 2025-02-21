import { User, Product, Message, InsertUser, InsertProduct, InsertMessage } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

async function hashInitialPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsByUser(userId: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Message operations
  getMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private messages: Map<number, Message>;
  sessionStore: session.Store;
  private currentUserId: number;
  private currentProductId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.messages = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentMessageId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Create default admin account with pre-hashed password
    this.initializeAdmin();
  }

  private async initializeAdmin() {
    const hashedPassword = await hashInitialPassword("admin123");
    this.createUser({
      username: "admin",
      password: hashedPassword,
      businessName: "ZarooriBazaar Admin",
      type: "Platform Administrator",
      description: "Main administrator of ZarooriBazaar platform",
      isAdmin: true,
      contactInfo: {
        email: "admin@zooribazaar.com"
      }
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user = { 
      ...insertUser, 
      id,
      description: insertUser.description || null,
      contactInfo: insertUser.contactInfo || null,
      isAdmin: insertUser.isAdmin || false
    };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByUser(userId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.userId === userId,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null,
      images: insertProduct.images || null
    };
    this.products.set(id, product);
    return product;
  }

  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.fromUserId === userId || message.toUserId === userId,
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message = { ...insertMessage, id };
    this.messages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();