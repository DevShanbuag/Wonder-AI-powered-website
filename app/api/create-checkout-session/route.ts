import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-03-25.dahlia' as any,
    });

    const supabase = createClient(
      process.env.SUPA_URL!,
      process.env.SUPA_ANON_KEY!
    );

    const body = await req.json();
    const { listingId, checkIn, checkOut, guests, totalAmount } = body;

    // Validate input
    if (!listingId || !checkIn || !checkOut || !guests || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user from Supabase auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check resort availability before creating booking
    const { data: availability, error: availabilityError } = await supabase
      .rpc('check_resort_availability', {
        resort_id: listingId,
        checkin_date: checkIn,
        checkout_date: checkOut
      });

    if (availabilityError || !availability) {
      return NextResponse.json(
        { error: 'Resort not available for selected dates' },
        { status: 409 }
      );
    }

    // Create booking with pending status
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        listing_id: listingId,
        user_id: user.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
        total_price: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Get resort details for Stripe checkout
    const { data: resort, error: resortError } = await supabase
      .from('resorts')
      .select('title, location')
      .eq('id', listingId)
      .single();

    if (resortError || !resort) {
      return NextResponse.json(
        { error: 'Resort not found' },
        { status: 404 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: resort.title,
              description: `${resort.location} - ${checkIn} to ${checkOut}`,
              images: [], // Add resort image if available
            },
            unit_amount: totalAmount * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/bookings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/listings/${listingId}`,
      metadata: {
        booking_id: booking.id,
        listing_id: listingId,
        user_id: user.id,
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
