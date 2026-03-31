export interface RazorpayOrderParams {
  bookingId: string;
  amount: number;
}

export interface RazorpayPaymentParams {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface Razorpay {
  open(): void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): Razorpay;
}

interface WindowWithRazorpay extends Window {
  Razorpay: RazorpayConstructor;
}

declare const window: WindowWithRazorpay;

export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<{ id: string; currency: string; amount: number }> {
  const response = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create Razorpay order');
  }

  return response.json();
}

export async function verifyRazorpayPayment(params: RazorpayPaymentParams): Promise<{ success: boolean; paymentId?: string }> {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to verify payment');
  }

  const result = await response.json();
  return {
    success: result.success,
    paymentId: result.paymentId,
  };
}

async function getAuthToken(): Promise<string> {
  const { supabase } = await import('./supabase');
  if (!supabase) return '';
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || '';
}

export function openRazorpayCheckout(orderId: string, amount: number, bookingId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      const Razorpay = window.Razorpay;
      
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_placeholder',
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'WonderStay',
        description: 'Resort Booking Payment',
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            await verifyRazorpayPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled'));
          },
        },
        prefill: {
          name: '', // Will be filled from user profile
          email: '', // Will be filled from user profile
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    };

    script.onerror = () => {
      reject(new Error('Failed to load Razorpay'));
    };

    document.body.appendChild(script);
  });
}
