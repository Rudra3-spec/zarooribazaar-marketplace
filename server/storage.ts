import { User, Product, Message, InsertUser, InsertProduct, InsertMessage, LoanApplication, GstRegistration, InsertLoanApplication, InsertGstRegistration, Promotion, Logistics, LearningResource, InsertPromotion, InsertLogistics, InsertLearningResource, BulkOrder, InsertBulkOrder, WholesaleDeal, InsertWholesaleDeal, ForumPost, InsertForumPost, ForumComment, InsertForumComment, Webinar, InsertWebinar, WebinarRegistration, InsertWebinarRegistration } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private messages: Map<number, Message>;
  private loanApplications: Map<number, LoanApplication>;
  private gstRegistrations: Map<number, GstRegistration>;
  private promotions: Map<number, Promotion>;
  private logistics: Map<number, Logistics>;
  private learningResources: Map<number, LearningResource>;
  sessionStore: session.Store;
  private currentUserId: number;
  private currentProductId: number;
  private currentMessageId: number;
  private currentLoanApplicationId: number;
  private currentGstRegistrationId: number;
  private currentPromotionId: number;
  private currentLogisticsId: number;
  private currentLearningResourceId: number;
  private bulkOrders: Map<number, BulkOrder>;
  private wholesaleDeals: Map<number, WholesaleDeal>;
  private forumPosts: Map<number, ForumPost>;
  private forumComments: Map<number, ForumComment>;
  private webinars: Map<number, Webinar>;
  private webinarRegistrations: Map<number, WebinarRegistration>;

  private currentBulkOrderId: number;
  private currentWholesaleDealId: number;
  private currentForumPostId: number;
  private currentForumCommentId: number;
  private currentWebinarId: number;
  private currentWebinarRegistrationId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.messages = new Map();
    this.loanApplications = new Map();
    this.gstRegistrations = new Map();
    this.promotions = new Map();
    this.logistics = new Map();
    this.learningResources = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentMessageId = 1;
    this.currentLoanApplicationId = 1;
    this.currentGstRegistrationId = 1;
    this.currentPromotionId = 1;
    this.currentLogisticsId = 1;
    this.currentLearningResourceId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.bulkOrders = new Map();
    this.wholesaleDeals = new Map();
    this.forumPosts = new Map();
    this.forumComments = new Map();
    this.webinars = new Map();
    this.webinarRegistrations = new Map();

    this.currentBulkOrderId = 1;
    this.currentWholesaleDealId = 1;
    this.currentForumPostId = 1;
    this.currentForumCommentId = 1;
    this.currentWebinarId = 1;
    this.currentWebinarRegistrationId = 1;

    // Create default admin account and financial institution
    this.initializeAdmin();
    this.initializeFinancialInstitution();
    this.initializeLearningResources();
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
    const user: User = {
      ...insertUser,
      id,
      description: insertUser.description || null,
      contactInfo: insertUser.contactInfo || null,
      isAdmin: insertUser.isAdmin || false,
      isFinancialInstitution: insertUser.isFinancialInstitution || false,
      creditScore: insertUser.creditScore || null,
      gstNumber: insertUser.gstNumber || null,
      gstStatus: insertUser.gstStatus || null
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

  async getLoanApplications(userId: number): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values()).filter(
      (app) => app.userId === userId
    );
  }

  async getFinancialInstitutions(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.isFinancialInstitution
    );
  }

  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const id = this.currentLoanApplicationId++;
    const application = { ...insertApplication, id };
    this.loanApplications.set(id, application);
    return application;
  }

  async getGstRegistration(userId: number): Promise<GstRegistration | undefined> {
    return Array.from(this.gstRegistrations.values()).find(
      (reg) => reg.userId === userId
    );
  }

  async createGstRegistration(insertRegistration: InsertGstRegistration): Promise<GstRegistration> {
    const id = this.currentGstRegistrationId++;
    const registration = { ...insertRegistration, id };
    this.gstRegistrations.set(id, registration);
    return registration;
  }

  async getPromotions(userId: number): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter(
      (promo) => promo.userId === userId
    );
  }

  async createPromotion(insertPromotion: InsertPromotion): Promise<Promotion> {
    const id = this.currentPromotionId++;
    const promotion = { ...insertPromotion, id };
    this.promotions.set(id, promotion);
    return promotion;
  }

  async getLogistics(userId: number): Promise<Logistics[]> {
    return Array.from(this.logistics.values()).filter(
      (shipment) => shipment.userId === userId
    );
  }

  async createLogistics(insertLogistics: InsertLogistics): Promise<Logistics> {
    const id = this.currentLogisticsId++;
    const logistics = { ...insertLogistics, id };
    this.logistics.set(id, logistics);
    return logistics;
  }

  async getLearningResources(): Promise<LearningResource[]> {
    return Array.from(this.learningResources.values());
  }

  async createLearningResource(insertResource: InsertLearningResource): Promise<LearningResource> {
    const id = this.currentLearningResourceId++;
    const resource = { ...insertResource, id };
    this.learningResources.set(id, resource);
    return resource;
  }
  // Bulk Order Methods
  async getBulkOrders(userId: number): Promise<BulkOrder[]> {
    return Array.from(this.bulkOrders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async createBulkOrder(insertOrder: InsertBulkOrder): Promise<BulkOrder> {
    const id = this.currentBulkOrderId++;
    const order: BulkOrder = { ...insertOrder, id };
    this.bulkOrders.set(id, order);
    return order;
  }

  // Wholesale Deal Methods
  async getWholesaleDeals(): Promise<WholesaleDeal[]> {
    return Array.from(this.wholesaleDeals.values());
  }

  async getWholesaleDealsByUser(userId: number): Promise<WholesaleDeal[]> {
    return Array.from(this.wholesaleDeals.values()).filter(
      (deal) => deal.userId === userId
    );
  }

  async createWholesaleDeal(insertDeal: InsertWholesaleDeal): Promise<WholesaleDeal> {
    const id = this.currentWholesaleDealId++;
    const deal: WholesaleDeal = { ...insertDeal, id };
    this.wholesaleDeals.set(id, deal);
    return deal;
  }

  // Forum Methods
  async getForumPosts(): Promise<ForumPost[]> {
    return Array.from(this.forumPosts.values());
  }

  async getForumPost(postId: number): Promise<ForumPost | undefined> {
    return this.forumPosts.get(postId);
  }

  async createForumPost(insertPost: InsertForumPost): Promise<ForumPost> {
    const id = this.currentForumPostId++;
    const post: ForumPost = { ...insertPost, id };
    this.forumPosts.set(id, post);
    return post;
  }

  async getForumComments(postId: number): Promise<ForumComment[]> {
    return Array.from(this.forumComments.values()).filter(
      (comment) => comment.postId === postId
    );
  }

  async createForumComment(insertComment: InsertForumComment): Promise<ForumComment> {
    const id = this.currentForumCommentId++;
    const comment: ForumComment = { ...insertComment, id };
    this.forumComments.set(id, comment);
    return comment;
  }

  // Webinar Methods
  async getWebinars(): Promise<Webinar[]> {
    return Array.from(this.webinars.values());
  }

  async getWebinar(webinarId: number): Promise<Webinar | undefined> {
    return this.webinars.get(webinarId);
  }

  async createWebinar(insertWebinar: InsertWebinar): Promise<Webinar> {
    const id = this.currentWebinarId++;
    const webinar: Webinar = { ...insertWebinar, id };
    this.webinars.set(id, webinar);
    return webinar;
  }

  async getWebinarRegistrations(webinarId: number): Promise<WebinarRegistration[]> {
    return Array.from(this.webinarRegistrations.values()).filter(
      (registration) => registration.webinarId === webinarId
    );
  }

  async createWebinarRegistration(insertRegistration: InsertWebinarRegistration): Promise<WebinarRegistration> {
    const id = this.currentWebinarRegistrationId++;
    const registration: WebinarRegistration = { ...insertRegistration, id };
    this.webinarRegistrations.set(id, registration);
    return registration;
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
      isFinancialInstitution: false,
      creditScore: null,
      gstNumber: null,
      gstStatus: null,
      contactInfo: {
        email: "admin@zooribazaar.com"
      }
    });
  }

  private async initializeFinancialInstitution() {
    const hashedPassword = await hashInitialPassword("bank123");
    this.createUser({
      username: "bank",
      password: hashedPassword,
      businessName: "MSME Finance Bank",
      type: "Financial Institution",
      description: "Leading provider of MSME loans and financial services",
      isAdmin: false,
      isFinancialInstitution: true,
      creditScore: null,
      gstNumber: null,
      gstStatus: null,
      contactInfo: {
        email: "loans@msmefinance.com",
        phone: "1800-MSME-LOAN",
        address: "Financial District, Mumbai"
      }
    });
  }

  private async initializeLearningResources() {
    // Add some initial learning resources
    this.createLearningResource({
      title: "Introduction to Digital Marketing",
      description: "Learn the basics of digital marketing for your MSME",
      type: "course",
      content: "Digital marketing fundamentals course content...",
      category: "Marketing",
      author: "Digital Marketing Expert",
      thumbnail: "https://example.com/thumbnail1.jpg",
      duration: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.createLearningResource({
      title: "Understanding GST for Small Businesses",
      description: "A comprehensive guide to GST compliance",
      type: "blog",
      content: "GST guide content...",
      category: "Finance",
      author: "Tax Expert",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
}

export const storage = new MemStorage();