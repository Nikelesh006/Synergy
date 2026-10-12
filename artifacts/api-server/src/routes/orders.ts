import { Router, type Request, type Response } from "express";
import { Order } from "../models/Order.js";
import crypto from "node:crypto";

const router = Router();

function generateTrackingId(): string {
  return "SYN" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase();
}

// POST /api/orders
router.post("/", async (req: Request, res: Response) => {
  try {
    const orderData = {
      ...req.body,
      trackingId: generateTrackingId(),
      status: "pending",
      paymentStatus: "pending",
    };
    const order = await Order.create(orderData);
    res.status(201).json({ ...order.toObject(), id: String(order._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create order", details: String(err) });
  }
});

// GET /api/orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, email } = req.query;
    const filter: Record<string, any> = {};
    if (userId) filter.userId = userId;
    if (email) filter["customer.email"] = email;
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders: orders.map((o: any) => ({ ...o, id: String(o._id) })) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders", details: String(err) });
  }
});

// GET /api/orders/user/:userId
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, orders: orders.map((o: any) => ({ ...o, id: String(o._id) })) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders", details: String(err) });
  }
});

// GET /api/orders/:trackingId
router.get("/:trackingId", async (req: Request, res: Response) => {
  try {
    const trackingId = String(req.params.trackingId);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(trackingId);
    const raw = await Order.findOne({
      $or: [{ trackingId }, { _id: isObjectId ? trackingId : null }],
    }).lean();
    if (!raw) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const order = raw as Record<string, unknown>;
    res.json({ ...order, id: String(order["_id"]) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order", details: String(err) });
  }
});

// PUT /api/orders/:id (Update status, paymentStatus, etc.)
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const updateData = req.body;
    const query = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { trackingId: id };
    
    const updated = await Order.findOneAndUpdate(query, updateData, { new: true }).lean();
    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const order = updated as Record<string, unknown>;
    res.json({ success: true, order: { ...order, id: String(order["_id"]) } });
  } catch (err) {
    res.status(500).json({ error: "Failed to update order", details: String(err) });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const query = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { trackingId: id };
    const deleted = await Order.findOneAndDelete(query).lean();
    if (!deleted) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order", details: String(err) });
  }
});

export default router;
