import Razorpay from "razorpay";
import crypto from "node:crypto";
import { logger } from "./logger.js";

/**
 * Checks whether valid Razorpay credentials have been supplied.
 */
export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";

  if (!keyId || !keySecret) return false;
  if (keyId.includes("your_razorpay") || keySecret.includes("your_razorpay")) return false;
  if (keyId === "YOUR_KEY_ID" || keySecret === "YOUR_KEY_SECRET") return false;

  return true;
}

/**
 * Returns the active Razorpay Key ID (or a placeholder if not set).
 */
export function getRazorpayKeyId(): string {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  if (isRazorpayConfigured()) {
    return keyId;
  }
  return keyId || "rzp_test_placeholder";
}

/**
 * Instantiates the Razorpay client instance.
 */
function getRazorpayInstance(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export interface CreateOrderParams {
  amountInINR: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  orderId: string;
  amount: number; // in paise
  currency: string;
  receipt?: string;
  keyId: string;
  isMock: boolean;
}

/**
 * Creates an order with Razorpay in paise.
 * If credentials are not configured yet, provides a simulated test order so checkout never breaks.
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  const { amountInINR, currency = "INR", receipt, notes } = params;
  const amountInPaise = Math.round(amountInINR * 100);

  if (!isRazorpayConfigured()) {
    logger.warn(
      "Razorpay API keys are not yet configured in environment variables. Operating in simulated test checkout mode."
    );
    const mockOrderId = `order_mock_${Date.now().toString(36)}_${crypto.randomBytes(3).toString("hex")}`;
    return {
      orderId: mockOrderId,
      amount: amountInPaise,
      currency,
      receipt: receipt || `SYN-${Date.now()}`,
      keyId: getRazorpayKeyId(),
      isMock: true,
    };
  }

  try {
    const instance = getRazorpayInstance();
    const order = await (instance.orders.create as any)({
      amount: amountInPaise,
      currency,
      receipt: receipt ? receipt.slice(0, 40) : `SYN-${Date.now().toString().slice(-8)}`,
      notes: notes || {},
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: getRazorpayKeyId(),
      isMock: false,
    };
  } catch (err: any) {
    logger.error({ err }, "Failed to create Razorpay order with official API");
    throw new Error(err?.message || "Failed to initialize payment gateway order");
  }
}

export interface VerifyPaymentParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Verifies Razorpay payment signature using HMAC-SHA256.
 */
export function verifyRazorpayPayment(params: VerifyPaymentParams): { verified: boolean; isMock: boolean } {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;

  // Handle simulated mock order verification
  if (razorpayOrderId.startsWith("order_mock_") || !isRazorpayConfigured()) {
    return { verified: true, isMock: true };
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const verified = expectedSignature === razorpaySignature;
  return { verified, isMock: false };
}
