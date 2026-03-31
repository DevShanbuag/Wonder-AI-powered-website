import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: booking, error: bookingError } = await serverSupabase
      .from('bookings')
      .select('listing_id, user_id')
      .eq('id', params.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check for overlapping bookings
    const { data: isAvailable, error: availabilityError } = await serverSupabase
      .rpc('check_resort_availability', {
        resort_id: booking.listing_id,
        checkin_date: body.start_date,
        checkout_date: body.end_date,
        exclude_booking_id: params.id
      });

    if (availabilityError) {
      return NextResponse.json({ error: availabilityError.message }, { status: 500 });
    }

    if (!isAvailable) {
      return NextResponse.json({ error: 'Dates overlap with an existing booking' }, { status: 409 });
    }

    const { error: updateError } = await serverSupabase
      .from('bookings')
      .update({ start_date: body.start_date, end_date: body.end_date })
      .eq('id', params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: params.id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const reason = body?.reason || 'Cancelled';
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: booking, error: bookingError } = await serverSupabase
      .from('bookings')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (booking.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error: updateError } = await serverSupabase
      .from('bookings')
      .update({ status: 'cancelled', cancellation_reason: reason })
      .eq('id', params.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: params.id }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
