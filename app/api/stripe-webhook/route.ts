import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia' as any,
  });

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;
    }

    case 'checkout.session.expired': {
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      await handleExpiredSession(expiredSession);
      break;
    }

    default:
      // Unhandled event type
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const bookingId = session.metadata?.booking_id;
    const listingId = session.metadata?.listing_id;
    const userId = session.metadata?.user_id;

    if (!bookingId || !listingId || !userId) {
      console.error('Missing metadata in session:', session.id);
      return;
    }

    if (!serverSupabase) {
      console.error('Supabase client is not initialized.');
      return;
    }
    if (!serverSupabase) {
      console.error('Supabase client is not initialized.');
      return;
    }

    const { error: updateError } = await serverSupabase
      .from('bookings')
      .update({
        status: 'confirmed',
        stripe_payment_id: session.payment_intent as string,
        payment_amount: session.amount_total ? session.amount_total / 100 : 0,
      })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return;
    }

    console.log(`Booking ${bookingId} confirmed successfully`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleExpiredSession(session: Stripe.Checkout.Session) {
  try {
    const bookingId = session.metadata?.booking_id;

    if (!bookingId) {
      console.error('Missing booking_id in expired session:', session.id);
      return;
    }

    if (!serverSupabase) {
      console.error('Supabase client is not initialized.');
      return;
    }

    const { error: updateError } = await serverSupabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancellation_reason: 'Payment session expired',
      })
      .eq('id', bookingId)
      .eq('status', 'pending');

    if (updateError) {
      console.error('Error updating booking:', updateError);
      return;
    }

  } catch (error) {
    console.error('Error handling expired session:', error);
  }
}
