import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProductSchema, insertMessageSchema, insertLoanApplicationSchema, insertGstRegistrationSchema, insertPromotionSchema, insertLogisticsSchema, insertLearningResourceSchema, insertBulkOrderSchema, insertWholesaleDealSchema, insertForumPostSchema, insertForumCommentSchema, insertWebinarSchema, insertWebinarRegistrationSchema } from "@shared/schema";
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
    console.log("Received product creation request:", req.body); // Debug log

    if (!req.user) {
      console.log("Unauthorized request - no user in session"); // Debug log
      return res.sendStatus(401);
    }

    const parsed = insertProductSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error("Product validation error:", parsed.error); // Debug log
      return res.status(400).json(parsed.error);
    }

    try {
      const product = await storage.createProduct({
        ...parsed.data,
        userId: req.user.id
      });
      console.log("Product created successfully:", product); // Debug log
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error); // Debug log
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Business Matching Routes
  app.get("/api/businesses/matching/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const matches = await storage.findMatchingBusinesses(
      parseInt(req.params.userId),
      req.query.type as string
    );
    res.json(matches);
  });

  app.get("/api/businesses/recommended/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const recommendations = await storage.getRecommendedPartners(
      parseInt(req.params.userId)
    );
    res.json(recommendations);
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

  // Bulk Orders
  app.get("/api/bulk-orders/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const orders = await storage.getBulkOrders(parseInt(req.params.userId));
    res.json(orders);
  });

  app.post("/api/bulk-orders", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertBulkOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const order = await storage.createBulkOrder({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(order);
  });

  // Wholesale Deals
  app.get("/api/wholesale-deals", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const deals = await storage.getWholesaleDeals();
    res.json(deals);
  });

  app.get("/api/wholesale-deals/user/:userId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const deals = await storage.getWholesaleDealsByUser(parseInt(req.params.userId));
    res.json(deals);
  });

  app.post("/api/wholesale-deals", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertWholesaleDealSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const deal = await storage.createWholesaleDeal({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(deal);
  });

  // Forum Posts
  app.get("/api/forum-posts", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const posts = await storage.getForumPosts();
    res.json(posts);
  });

  app.get("/api/forum-posts/:postId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const post = await storage.getForumPost(parseInt(req.params.postId));
    if (!post) return res.sendStatus(404);
    res.json(post);
  });

  app.post("/api/forum-posts", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertForumPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const post = await storage.createForumPost({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(post);
  });

  // Forum Comments
  app.get("/api/forum-posts/:postId/comments", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const comments = await storage.getForumComments(parseInt(req.params.postId));
    res.json(comments);
  });

  app.post("/api/forum-comments", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertForumCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const comment = await storage.createForumComment({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(comment);
  });

  // Webinars
  app.get("/api/webinars", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const webinars = await storage.getWebinars();
    res.json(webinars);
  });

  app.get("/api/webinars/:webinarId", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const webinar = await storage.getWebinar(parseInt(req.params.webinarId));
    if (!webinar) return res.sendStatus(404);
    res.json(webinar);
  });

  app.post("/api/webinars", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertWebinarSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const webinar = await storage.createWebinar({
      ...parsed.data,
      hostId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(webinar);
  });

  // Webinar Registrations
  app.get("/api/webinars/:webinarId/registrations", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const registrations = await storage.getWebinarRegistrations(parseInt(req.params.webinarId));
    res.json(registrations);
  });

  app.post("/api/webinar-registrations", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const parsed = insertWebinarRegistrationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const registration = await storage.createWebinarRegistration({
      ...parsed.data,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    res.status(201).json(registration);
  });

  app.patch("/api/users/:id", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    if (req.user.id !== parseInt(req.params.id)) return res.sendStatus(403);

    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  setupWebSocket(httpServer);

  return httpServer;
}