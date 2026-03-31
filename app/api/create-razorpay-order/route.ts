import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const body = await req.json();
    const { bookingId, amount } = body;

    if (!bookingId || !amount) {
      return NextResponse.json(
        { error: 'Missing bookingId or amount' },
        { status: 400 }
      );
    }

    if (!serverSupabase) {
      return NextResponse.json(
        { error: 'Server configuration missing' },
        { status: 500 }
      );
    }

    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: booking, error: bookingError } = await serverSupabase
      .from('bookings')
      .select('*, razorpay_order_id')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found or not in pending status' },
        { status: 404 }
      );
    }

    if (booking.razorpay_order_id) {
      const order = await razorpay.orders.fetch(booking.razorpay_order_id);
      return NextResponse.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
      });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: bookingId,
      notes: {
        bookingId: bookingId,
        userId: user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    if (serverSupabase) {
      await serverSupabase
        .from('bookings')
        .update({ razorpay_order_id: order.id })
        .eq('id', bookingId);
    }

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
