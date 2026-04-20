export interface RazorpayOrderParams {
  amount: number;
  metadata?: Record<string, any>;
}

export interface RazorpayPaymentParams {
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

export async function createRazorpayOrder(params: RazorpayOrderParams): Promise<{ order_id: string; currency: string; amount: number }> {
  const { createClient } = await import('@/utils/supabase/client');
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const response = await fetch('/api/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
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
  const { createClient } = await import('@/utils/supabase/client');
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || ''}`,
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

export function openRazorpayCheckout(
  orderId: string, 
  amount: number, 
  onSuccess: (response: RazorpayResponse) => Promise<void>,
  prefill?: { name?: string; email?: string }
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      const Razorpay = window.Razorpay;
      
      const options: RazorpayOptions = {
        key: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_RAZORPAY_KEY_ID) || (import.meta as any).env?.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_Sfdl45Q3Um5chO',
        amount: Math.round(amount), // Amount is already in paise from createOrder
        currency: 'INR',
        name: 'WonderStay',
        description: 'Resort Booking Payment',
        order_id: orderId,
        handler: async function (response: RazorpayResponse) {
          try {
            await onSuccess(response);
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
          name: prefill?.name || '',
          email: prefill?.email || '',
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
