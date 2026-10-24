import { Router, type Request, type Response } from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getRazorpayKeyId,
  isRazorpayConfigured,
} from "../lib/razorpay.js";
import { Order } from "../models/Order.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";
import { logger } from "../lib/logger.js";

const router = Router();

/**
 * GET /api/payment/razorpay/config
 * Returns public key & whether credentials have been loaded.
 */
router.get("/razorpay/config", (_req: Request, res: Response) => {
  res.json({
    success: true,
    keyId: getRazorpayKeyId(),
    isConfigured: isRazorpayConfigured(),
    currency: "INR",
  });
});

/**
 * POST /api/payment/razorpay/create-order
 * Creates an order via Razorpay API in paise (1 INR = 100 paise).
 */
router.post("/razorpay/create-order", async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    if (!amount || Number(amount) <= 0) {
      res.status(400).json({ error: "A valid positive amount is required" });
      return;
    }

    const order = await createRazorpayOrder({
      amountInINR: Number(amount),
      currency: currency || "INR",
      receipt: receipt || `SYN-${Date.now()}`,
      notes: notes || {},
    });

    res.json({
      success: true,
      order,
    });
  } catch (err: any) {
    logger.error({ err }, "Error creating Razorpay order");
    res.status(500).json({
      error: err?.message || "Failed to initialize Razorpay order",
    });
  }
});

/**
 * POST /api/payment/razorpay/verify
 * Cryptographically verifies HMAC SHA-256 payment signature and confirms order payment.
 */
router.post("/razorpay/verify", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
      trackingId,
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({
        success: false,
        error: "Missing required payment parameters (razorpayOrderId, razorpayPaymentId, razorpaySignature)",
      });
      return;
    }

    const { verified, isMock } = verifyRazorpayPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!verified) {
      logger.warn(
        { razorpayOrderId, razorpayPaymentId },
        "Razorpay payment verification failed: signature mismatch"
      );
      res.status(400).json({
        success: false,
        error: "Payment verification failed: Signature mismatch",
      });
      return;
    }

    // Update order status if order reference is provided
    const targetId = orderId || trackingId;
    if (targetId) {
      const updateData = {
        paymentStatus: "paid",
        status: "confirmed",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      };

      if (isDbConnected()) {
        try {
          await Order.findOneAndUpdate(
            { $or: [{ _id: targetId }, { id: targetId }, { trackingId: targetId }] },
            { $set: updateData },
            { new: true }
          );
        } catch (dbErr) {
          logger.warn({ dbErr }, "Could not update order in MongoDB on payment verify");
        }
      }
      inMemoryStore.updateOrder(targetId, updateData);
    }

    res.json({
      success: true,
      verified: true,
      isMock,
      message: "Payment successfully verified and confirmed",
    });
  } catch (err: any) {
    logger.error({ err }, "Error in payment verify endpoint");
    res.status(500).json({
      success: false,
      error: err?.message || "Internal server error verifying payment",
    });
  }
});

export default router;
