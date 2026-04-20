import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(
  ((typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : undefined) || import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) || 'pk_test_placeholder'
);

export interface CheckoutSessionParams {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
}

export async function createCheckoutSession(params: CheckoutSessionParams): Promise<{ sessionId: string }> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
}

async function getAuthToken(): Promise<string> {
  // This should be implemented based on your auth system
  // For Supabase, you would get the token from the session
  const { supabase } = await import('./supabase');
  if (!supabase) return '';
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || '';
}

export async function redirectToStripeCheckout(sessionId: string) {
  // Redirect to Stripe Checkout using window.location
  window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
}
