// src/types/global.d.ts
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

// Define Razorpay options based on official Razorpay docs
interface RazorpayOptions {
  key: string;
  amount: number;
  name: string;
  description?: string;
  // currency: string;
  order_id: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
}

// Define Razorpay instance
interface RazorpayInstance {
  open(): void;
  on(
    event: RazorpayEvent,
    callback: (response: RazorpayPaymentError) => void
  ): void;
}

// Define response structure for successful payment
interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Define possible Razorpay events
type RazorpayEvent = "payment.failed" | "payment.success";

// Define error structure for failed payments
interface RazorpayPaymentError {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export {};
