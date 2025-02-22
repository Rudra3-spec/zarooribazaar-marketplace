import { users, products, messages, loanApplications, gstRegistrations, promotions, logistics, learningResources, bulkOrders, wholesaleDeals, forumPosts, forumComments, webinars, webinarRegistrations, type User, type Product, type Message, type LoanApplication, type GstRegistration, type Promotion, type Logistics, type LearningResource, type BulkOrder, type WholesaleDeal, type ForumPost, type ForumComment, type Webinar, type WebinarRegistration, type InsertUser, type InsertProduct, type InsertMessage, type InsertLoanApplication, type InsertGstRegistration, type InsertPromotion, type InsertLogistics, type InsertLearningResource, type InsertBulkOrder, type InsertWholesaleDeal, type InsertForumPost, type InsertForumComment, type InsertWebinar, type InsertWebinarRegistration } from "@shared/schema";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { db } from "./db";
import { eq, or } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const PostgresSessionStore = connectPg(session);
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

  // Loan Application operations
  getLoanApplications(userId: number): Promise<LoanApplication[]>;
  getFinancialInstitutions(): Promise<User[]>;
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;

  // GST Registration operations
  getGstRegistration(userId: number): Promise<GstRegistration | undefined>;
  createGstRegistration(registration: InsertGstRegistration): Promise<GstRegistration>;

  // Promotion operations
  getPromotions(userId: number): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;

  // Logistics operations
  getLogistics(userId: number): Promise<Logistics[]>;
  createLogistics(logistics: InsertLogistics): Promise<Logistics>;

  // Learning Resource operations
  getLearningResources(): Promise<LearningResource[]>;
  createLearningResource(resource: InsertLearningResource): Promise<LearningResource>;

  // Session operations
  sessionStore: session.Store;
  getSession(sessionId: string): Promise<session.Session | null>;

  // Bulk Order operations
  getBulkOrders(userId: number): Promise<BulkOrder[]>;
  createBulkOrder(order: InsertBulkOrder): Promise<BulkOrder>;

  // Wholesale Deal operations
  getWholesaleDeals(): Promise<WholesaleDeal[]>;
  getWholesaleDealsByUser(userId: number): Promise<WholesaleDeal[]>;
  createWholesaleDeal(deal: InsertWholesaleDeal): Promise<WholesaleDeal>;

  // Forum operations
  getForumPosts(): Promise<ForumPost[]>;
  getForumPost(postId: number): Promise<ForumPost | undefined>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumComments(postId: number): Promise<ForumComment[]>;
  createForumComment(comment: InsertForumComment): Promise<ForumComment>;

  // Webinar operations
  getWebinars(): Promise<Webinar[]>;
  getWebinar(webinarId: number): Promise<Webinar | undefined>;
  createWebinar(webinar: InsertWebinar): Promise<Webinar>;
  getWebinarRegistrations(webinarId: number): Promise<WebinarRegistration[]>;
  createWebinarRegistration(registration: InsertWebinarRegistration): Promise<WebinarRegistration>;
  findMatchingBusinesses(userId: number, businessType: string): Promise<User[]>;
  getRecommendedPartners(userId: number): Promise<User[]>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values([insertUser]).returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByUser(userId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values([insertProduct]).returning();
    return product;
  }

  async getMessages(userId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(
        or(
          eq(messages.fromUserId, userId),
          eq(messages.toUserId, userId)
        )
      );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values([insertMessage]).returning();
    return message;
  }

  async getLoanApplications(userId: number): Promise<LoanApplication[]> {
    return await db.select().from(loanApplications).where(eq(loanApplications.userId, userId));
  }

  async getFinancialInstitutions(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isFinancialInstitution, true));
  }

  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const [application] = await db.insert(loanApplications).values([insertApplication]).returning();
    return application;
  }

  async getGstRegistration(userId: number): Promise<GstRegistration | undefined> {
    const [registration] = await db.select().from(gstRegistrations).where(eq(gstRegistrations.userId, userId));
    return registration;
  }

  async createGstRegistration(insertRegistration: InsertGstRegistration): Promise<GstRegistration> {
    const [registration] = await db.insert(gstRegistrations).values([insertRegistration]).returning();
    return registration;
  }

  async getPromotions(userId: number): Promise<Promotion[]> {
    return await db.select().from(promotions).where(eq(promotions.userId, userId));
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const [promotion] = await db.insert(promotions).values([insertPromotion]).returning();
    return promotion;
  }

  async getLogistics(userId: number): Promise<Logistics[]> {
    return await db.select().from(logistics).where(eq(logistics.userId, userId));
  }

  async createLogistics(insertLogistics: InsertLogistics): Promise<Logistics> {
    const [logistics] = await db.insert(logistics).values([insertLogistics]).returning();
    return logistics;
  }

  async getLearningResources(): Promise<LearningResource[]> {
    return await db.select().from(learningResources);
  }

  async createLearningResource(insertResource: InsertLearningResource): Promise<LearningResource> {
    const [resource] = await db.insert(learningResources).values([insertResource]).returning();
    return resource;
  }
  async getSession(sessionId: string): Promise<session.Session | null> {
    return new Promise((resolve, reject) => {
      this.sessionStore.get(sessionId, (error, session) => {
        if (error) {
          reject(error);
        } else {
          resolve(session || null);
        }
      });
    });
  }

  async getBulkOrders(userId: number): Promise<BulkOrder[]> {
    return await db.select().from(bulkOrders).where(eq(bulkOrders.userId, userId));
  }

  async createBulkOrder(insertOrder: InsertBulkOrder): Promise<BulkOrder> {
    const [order] = await db.insert(bulkOrders).values([insertOrder]).returning();
    return order;
  }

  async getWholesaleDeals(): Promise<WholesaleDeal[]> {
    return await db.select().from(wholesaleDeals);
  }

  async getWholesaleDealsByUser(userId: number): Promise<WholesaleDeal[]> {
    return await db.select().from(wholesaleDeals).where(eq(wholesaleDeals.userId, userId));
  }

  async createWholesaleDeal(insertDeal: InsertWholesaleDeal): Promise<WholesaleDeal> {
    const [deal] = await db.insert(wholesaleDeals).values([insertDeal]).returning();
    return deal;
  }

  async getForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(forumPosts);
  }

  async getForumPost(postId: number): Promise<ForumPost | undefined> {
    const [post] = await db.select().from(forumPosts).where(eq(forumPosts.id, postId));
    return post;
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const [post] = await db.insert(forumPosts).values([insertPost]).returning();
    return post;
  }

  async getForumComments(postId: number): Promise<ForumComment[]> {
    return await db.select().from(forumComments).where(eq(forumComments.postId, postId));
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const [comment] = await db.insert(forumComments).values([insertComment]).returning();
    return comment;
  }

  async getWebinars(): Promise<Webinar[]> {
    return await db.select().from(webinars);
  }

  async getWebinar(webinarId: number): Promise<Webinar | undefined> {
    const [webinar] = await db.select().from(webinars).where(eq(webinars.id, webinarId));
    return webinar;
  }

  async createWebinar(insertWebinar: InsertWebinar): Promise<Webinar> {
    const [webinar] = await db.insert(webinars).values([insertWebinar]).returning();
    return webinar;
  }

  async getWebinarRegistrations(webinarId: number): Promise<WebinarRegistration[]> {
    return await db.select().from(webinarRegistrations).where(eq(webinarRegistrations.webinarId, webinarId));
  }

  async createWebinarRegistration(insertRegistration: InsertWebinarRegistration): Promise<WebinarRegistration> {
    const [registration] = await db.insert(webinarRegistrations).values([insertRegistration]).returning();
    return registration;
  }

  async findMatchingBusinesses(userId: number, businessType: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.type, businessType));
  }

  async getRecommendedPartners(userId: number): Promise<User[]> {
    // In a real implementation, this would include more sophisticated matching logic
    return await db.select().from(users);
  }
}

export const storage = new DatabaseStorage();