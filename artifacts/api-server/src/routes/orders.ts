import { Router, type Request, type Response } from "express";
import { Order } from "../models/Order.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";
import crypto from "node:crypto";
import { isEmailAdmin, requireAdmin } from "../middlewares/admin.js";

const router = Router();

function getRequesterIdentity(req: Request) {
  let email: string | null = null;
  let userId: string | null = null;

  if (req.isAuthenticated && req.isAuthenticated()) {
    const sessionUser = req.user as any;
    if (sessionUser?.email) email = sessionUser.email;
    if (sessionUser?._id) userId = String(sessionUser._id);
  }

  if (!email && req.headers["x-user-email"]) {
    email = String(req.headers["x-user-email"]).trim().toLowerCase();
  }
  if (!userId && req.headers["x-user-id"]) {
    userId = String(req.headers["x-user-id"]).trim();
  }

  const isAdmin = isEmailAdmin(email);
  return { email, userId, isAdmin };
}

function generateTrackingId(): string {
  return "SYN" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase();
}

function normalizeItem(item: any) {
  if (!item) return { productId: "", name: "Hardware Item", sku: "SYN-SKU", image: "/categories/embedded-boards.jpg", price: 0, quantity: 1 };
  const prod = typeof item.product === "object" && item.product !== null ? item.product : {};
  const productId = String(item.productId || prod.id || prod._id || (typeof item.product === "string" ? item.product : ""));
  const name = String(item.name || prod.name || item.title || prod.title || "Hardware Item");
  const sku = String(item.sku || prod.sku || "SYN-SKU");
  const image = String(
    item.image ||
    (Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : prod.image) ||
    "/categories/embedded-boards.jpg"
  );
  const price = Number(item.price ?? item.unitPrice ?? prod.price ?? 0) || 0;
  const quantity = Number(item.quantity ?? 1) || 1;

  return {
    productId,
    name,
    sku,
    image,
    price,
    quantity,
  };
}

function formatOrder(order: any) {
  if (!order) return order;
  const rawItems = Array.isArray(order.items) ? order.items : [];
  const items = rawItems.map(normalizeItem);
  return {
    ...order,
    id: String(order._id || order.id),
    items,
  };
}

// POST /api/orders
router.post("/", async (req: Request, res: Response) => {
  try {
    const trackingId = generateTrackingId();
    const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
    const items = rawItems.map(normalizeItem);
    const orderData = {
      ...req.body,
      items,
      trackingId,
      status: req.body.status || "pending",
      paymentStatus: req.body.paymentStatus || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isDbConnected()) {
      try {
        const order = await Order.create(orderData);
        const formatted = formatOrder(order.toObject());
        inMemoryStore.addOrder(formatted);
        res.status(201).json(formatted);
        return;
      } catch (dbErr) {
        console.warn("MongoDB order creation failed, falling back to in-memory store:", dbErr);
      }
    }

    const saved = inMemoryStore.addOrder(orderData);
    res.status(201).json(formatOrder(saved));
  } catch (err) {
    res.status(400).json({ error: "Failed to create order", details: String(err) });
  }
});

// GET /api/orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const { email: authEmail, userId: authUserId, isAdmin } = getRequesterIdentity(req);
    const queryUserId = req.query.userId ? String(req.query.userId) : null;
    const queryEmail = req.query.email ? String(req.query.email).trim().toLowerCase() : null;

    let filter: Record<string, any> = {};

    if (isAdmin) {
      // Administrator can view all orders, or optionally filter by query params
      if (queryUserId) filter.userId = queryUserId;
      if (queryEmail) filter["customer.email"] = queryEmail;
    } else {
      // Non-administrators can strictly ONLY view their own orders
      const targetUserId = authUserId || queryUserId;
      const targetEmail = authEmail || queryEmail;

      if (!targetUserId && !targetEmail) {
        res.json({ success: true, orders: [] });
        return;
      }

      const orConditions: any[] = [];
      if (authUserId) orConditions.push({ userId: authUserId });
      if (authEmail) orConditions.push({ "customer.email": authEmail });
      if (orConditions.length === 0) {
        if (targetUserId) orConditions.push({ userId: targetUserId });
        if (targetEmail) orConditions.push({ "customer.email": targetEmail });
      }

      filter = orConditions.length === 1 ? orConditions[0] : { $or: orConditions };
    }

    if (isDbConnected()) {
      try {
        const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
        if (orders && orders.length > 0) {
          res.json({ success: true, orders: orders.map(formatOrder) });
          return;
        }
      } catch (dbErr) {
        console.warn("MongoDB orders query failed, checking in-memory store:", dbErr);
      }
    }

    const memOrders = inMemoryStore.getOrders(
      isAdmin
        ? { userId: queryUserId || undefined, email: queryEmail || undefined }
        : { userId: authUserId || queryUserId || undefined, email: authEmail || queryEmail || undefined }
    );
    res.json({ success: true, orders: memOrders.map(formatOrder) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: String(err) });
  }
});

// GET /api/orders/user/:userId
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const targetUserId = String(req.params.userId);
    const { email: authEmail, userId: authUserId, isAdmin } = getRequesterIdentity(req);

    // User isolation: Requester must be admin OR target user themselves
    if (!isAdmin && authUserId && authUserId !== targetUserId) {
      res.status(403).json({ error: "Access denied. You can only view your own orders." });
      return;
    }

    const filter = { userId: targetUserId };
    if (isDbConnected()) {
      try {
        const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
        if (orders && orders.length > 0) {
          res.json({ success: true, orders: orders.map(formatOrder) });
          return;
        }
      } catch (dbErr) {
        console.warn("MongoDB user orders query failed:", dbErr);
      }
    }

    const memOrders = inMemoryStore.getOrders({ userId: targetUserId });
    res.json({ success: true, orders: memOrders.map(formatOrder) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders", details: String(err) });
  }
});

// GET /api/orders/:trackingId
router.get("/:trackingId", async (req: Request, res: Response) => {
  try {
    const trackingId = String(req.params.trackingId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(trackingId);

    if (isDbConnected()) {
      try {
        const raw = await Order.findOne({
          $or: [{ trackingId }, { _id: isObjectId ? trackingId : null }],
        }).lean();
        if (raw) {
          res.json(formatOrder(raw));
          return;
        }
      } catch (dbErr) {
        console.warn("MongoDB order lookup failed:", dbErr);
      }
    }

    const memOrder = inMemoryStore.findOrder(trackingId);
    if (!memOrder) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(formatOrder(memOrder));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order", details: String(err) });
  }
});

// PUT /api/orders/:id (Admin-only: update status, paymentStatus, etc.)
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updateData = req.body;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { trackingId: id };

    let updatedOrder: any = null;

    if (isDbConnected()) {
      try {
        updatedOrder = await Order.findOneAndUpdate(query, updateData, { new: true }).lean();
      } catch (dbErr) {
        console.warn("MongoDB update order failed:", dbErr);
      }
    }

    // Always update inMemoryStore
    const memUpdated = inMemoryStore.updateOrder(id, updateData);
    const result = updatedOrder || memUpdated;

    if (!result) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ success: true, order: formatOrder(result) });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order", details: String(err) });
  }
});

// DELETE /api/orders/:id (Admin-only)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { trackingId: id };

    let deleted = false;
    if (isDbConnected()) {
      try {
        const resDb = await Order.findOneAndDelete(query).lean();
        if (resDb) deleted = true;
      } catch (dbErr) {
        console.warn("MongoDB delete order failed:", dbErr);
      }
    }

    const memDeleted = inMemoryStore.deleteOrder(id);
    if (!deleted && !memDeleted) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order", details: String(err) });
  }
});

export default router;
