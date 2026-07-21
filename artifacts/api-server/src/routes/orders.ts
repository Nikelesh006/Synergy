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

// GET /api/orders/:trackingId
router.get("/:trackingId", async (req: Request, res: Response) => {
  try {
    const raw = await Order.findOne({ trackingId: req.params["trackingId"] }).lean();
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

export default router;
