import { pgTable, text, serial, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  businessName: text("business_name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  isAdmin: boolean("is_admin").notNull().default(false),
  isFinancialInstitution: boolean("is_financial_institution").notNull().default(false),
  creditScore: integer("credit_score"),
  gstNumber: text("gst_number"),
  gstStatus: text("gst_status"),
  contactInfo: jsonb("contact_info").$type<{
    email: string;
    phone?: string;
    address?: string;
  }>(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  category: text("category").notNull(),
  images: text("images").array(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id"),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
  isAiMessage: boolean("is_ai_message").notNull().default(false),
});

export const loanApplications = pgTable("loan_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  purpose: text("purpose").notNull(),
  status: text("status").notNull().default("pending"),
  financialInstitutionId: integer("financial_institution_id"),
  documents: jsonb("documents").$type<{
    businessPlan?: string;
    financialStatements?: string;
    taxReturns?: string;
  }>(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const gstRegistrations = pgTable("gst_registrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  businessType: text("business_type").notNull(),
  annualTurnover: integer("annual_turnover").notNull(),
  status: text("status").notNull().default("pending"),
  documents: jsonb("documents").$type<{
    panCard?: string;
    addressProof?: string;
    businessRegistration?: string;
  }>(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  budget: integer("budget"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  metrics: jsonb("metrics").$type<{
    views?: number;
    clicks?: number;
    conversions?: number;
  }>(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const logistics = pgTable("logistics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderId: text("order_id").notNull(),
  status: text("status").notNull(),
  trackingNumber: text("tracking_number"),
  courierService: text("courier_service"),
  origin: jsonb("origin").$type<{
    address: string;
    city: string;
    state: string;
    pincode: string;
  }>(),
  destination: jsonb("destination").$type<{
    address: string;
    city: string;
    state: string;
    pincode: string;
  }>(),
  timeline: jsonb("timeline").$type<{
    events: Array<{
      status: string;
      location: string;
      timestamp: string;
    }>;
  }>(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  thumbnail: text("thumbnail"),
  duration: integer("duration"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const bulkOrders = pgTable("bulk_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  requestedPrice: integer("requested_price").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const wholesaleDeals = pgTable("wholesale_deals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  minQuantity: integer("min_quantity").notNull(),
  pricePerUnit: integer("price_per_unit").notNull(),
  availability: boolean("availability").notNull().default(true),
  description: text("description"),
  terms: text("terms"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  views: integer("views").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const webinars = pgTable("webinars", {
  id: serial("id").primaryKey(),
  hostId: integer("host_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  scheduledAt: text("scheduled_at").notNull(),
  duration: integer("duration").notNull(),
  maxParticipants: integer("max_participants"),
  registrationDeadline: text("registration_deadline"),
  status: text("status").notNull().default("upcoming"),
  meetingLink: text("meeting_link"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const webinarRegistrations = pgTable("webinar_registrations", {
  id: serial("id").primaryKey(),
  webinarId: integer("webinar_id").notNull(),
  userId: integer("user_id").notNull(),
  status: text("status").notNull().default("registered"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products);
export const insertMessageSchema = createInsertSchema(messages);
export const insertLoanApplicationSchema = createInsertSchema(loanApplications);
export const insertGstRegistrationSchema = createInsertSchema(gstRegistrations);
export const insertPromotionSchema = createInsertSchema(promotions);
export const insertLogisticsSchema = createInsertSchema(logistics);
export const insertLearningResourceSchema = createInsertSchema(learningResources);
export const insertBulkOrderSchema = createInsertSchema(bulkOrders);
export const insertWholesaleDealSchema = createInsertSchema(wholesaleDeals);
export const insertForumPostSchema = createInsertSchema(forumPosts);
export const insertForumCommentSchema = createInsertSchema(forumComments);
export const insertWebinarSchema = createInsertSchema(webinars);
export const insertWebinarRegistrationSchema = createInsertSchema(webinarRegistrations);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type InsertGstRegistration = z.infer<typeof insertGstRegistrationSchema>;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type InsertLogistics = z.infer<typeof insertLogisticsSchema>;
export type InsertLearningResource = z.infer<typeof insertLearningResourceSchema>;
export type InsertBulkOrder = z.infer<typeof insertBulkOrderSchema>;
export type InsertWholesaleDeal = z.infer<typeof insertWholesaleDealSchema>;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;
export type InsertWebinar = z.infer<typeof insertWebinarSchema>;
export type InsertWebinarRegistration = z.infer<typeof insertWebinarRegistrationSchema>;

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type GstRegistration = typeof gstRegistrations.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Logistics = typeof logistics.$inferSelect;
export type LearningResource = typeof learningResources.$inferSelect;
export type BulkOrder = typeof bulkOrders.$inferSelect;
export type WholesaleDeal = typeof wholesaleDeals.$inferSelect;
export type ForumPost = typeof forumPosts.$inferSelect;
export type ForumComment = typeof forumComments.$inferSelect;
export type Webinar = typeof webinars.$inferSelect;
export type WebinarRegistration = typeof webinarRegistrations.$inferSelect;