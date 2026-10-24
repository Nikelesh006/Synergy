import { fetchApi } from "./api";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

/**
 * Dynamically loads the official Razorpay Checkout SDK script.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK from checkout.razorpay.com");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayConfigResponse {
  success: boolean;
  keyId: string;
  isConfigured: boolean;
  currency: string;
}

/**
 * Fetches Razorpay public configuration from our API server.
 */
export async function getRazorpayConfig(): Promise<RazorpayConfigResponse> {
  try {
    const res = await fetchApi<RazorpayConfigResponse>("/payment/razorpay/config");
    return res;
  } catch (err) {
    console.warn("Could not fetch Razorpay config from API:", err);
    const envKey = (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined) || "";
    return {
      success: true,
      keyId: envKey || "rzp_test_placeholder",
      isConfigured: Boolean(envKey && !envKey.includes("placeholder")),
      currency: "INR",
    };
  }
}

export interface RazorpayPaymentSuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface OpenRazorpayOptions {
  amountInINR: number;
  orderReceipt?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: Record<string, string>;
  onSuccess: (paymentResult: RazorpayPaymentSuccessResponse, isSimulated?: boolean) => Promise<void> | void;
  onDismiss?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Orchestrates creating the backend Razorpay order and launching the Razorpay payment modal.
 * If credentials are not yet configured on the server, safely provides a simulated payment dialog so the user can test the complete UI flow immediately!
 */
export async function launchRazorpayCheckout(options: OpenRazorpayOptions): Promise<void> {
  const { amountInINR, orderReceipt, customer, notes, onSuccess, onDismiss, onError } = options;

  // 1. Create order on API server
  let orderData: any = null;
  try {
    const res = await fetchApi<{ success: boolean; order: any }>("/payment/razorpay/create-order", {
      method: "POST",
      body: JSON.stringify({
        amount: amountInINR,
        currency: "INR",
        receipt: orderReceipt,
        notes,
      }),
    });
    orderData = res.order;
  } catch (err: any) {
    console.error("Order creation with payment gateway failed:", err);
    if (onError) onError(err);
    return;
  }

  // 2. If backend signaled simulated mock mode (e.g. before API keys are added), run simulated success flow
  if (orderData?.isMock) {
    const simulatedPaymentId = `pay_mock_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const simulatedSignature = `sig_mock_${Math.random().toString(36).slice(2, 10)}`;

    await onSuccess(
      {
        razorpay_order_id: orderData.orderId,
        razorpay_payment_id: simulatedPaymentId,
        razorpay_signature: simulatedSignature,
      },
      true
    );
    return;
  }

  // 3. Load Razorpay script
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded || !window.Razorpay) {
    const err = new Error("Unable to load Razorpay payment SDK. Please check your internet connection.");
    if (onError) onError(err);
    return;
  }

  // 4. Open Razorpay modal
  const rzpOptions = {
    key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.amount, // in paise
    currency: orderData.currency || "INR",
    name: "Synergy Tech Labs",
    description: `Hardware Order ${orderReceipt || ""}`.trim(),
    image: "/synergy-logo-footer.png",
    order_id: orderData.orderId,
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    notes: {
      receipt: orderReceipt || "",
      ...notes,
    },
    theme: {
      color: "#0B192C",
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) onDismiss();
      },
      escape: true,
      backdropclose: false,
    },
    handler: async (response: RazorpayPaymentSuccessResponse) => {
      try {
        await onSuccess(response, false);
      } catch (handlerErr: any) {
        console.error("Error in Razorpay success handler:", handlerErr);
        if (onError) onError(handlerErr);
      }
    },
  };

  const razorpayInstance = new window.Razorpay(rzpOptions);

  razorpayInstance.on("payment.failed", (response: any) => {
    console.error("Razorpay payment failed callback:", response?.error);
    const failureReason = response?.error?.description || "Payment was declined or cancelled";
    if (onError) onError(new Error(failureReason));
  });

  razorpayInstance.open();
}
