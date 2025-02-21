import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertMessageSchema, insertLoanApplicationSchema, insertGstRegistrationSchema, insertPromotionSchema, insertLogisticsSchema, insertLearningResourceSchema } from "@shared/schema";
import { setupWebSocket } from "./websocket";

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

  // Loan Applications
  app.get("/api/loan-applications/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const applications = await storage.getLoanApplications(parseInt(req.params.userId));
    res.json(applications);
  });

  app.get("/api/financial-institutions", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const institutions = await storage.getFinancialInstitutions();
    res.json(institutions);
  });

  app.post("/api/loan-applications", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertLoanApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const application = await storage.createLoanApplication({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(application);
  });

  // GST Registration
  app.get("/api/gst-registration/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const registration = await storage.getGstRegistration(parseInt(req.params.userId));
    res.json(registration);
  });

  app.post("/api/gst-registration", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertGstRegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const registration = await storage.createGstRegistration({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(registration);
  });

  // Promotions
  app.get("/api/promotions/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const promotions = await storage.getPromotions(parseInt(req.params.userId));
    res.json(promotions);
  });

  app.post("/api/promotions", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertPromotionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const promotion = await storage.createPromotion({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(promotion);
  });

  // Logistics
  app.get("/api/logistics/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const shipments = await storage.getLogistics(parseInt(req.params.userId));
    res.json(shipments);
  });

  app.post("/api/logistics", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertLogisticsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const shipment = await storage.createLogistics({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(shipment);
  });

  // Learning Resources
  app.get("/api/learning-resources", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const resources = await storage.getLearningResources();
    res.json(resources);
  });

  app.post("/api/learning-resources", async (req, res) => {
    if (!req.user?.isAdmin) return res.sendStatus(403);
    const parsed = insertLearningResourceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const resource = await storage.createLearningResource({
      ...parsed.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(resource);
  });

  const httpServer = createServer(app);
  setupWebSocket(httpServer);

  return httpServer;
}