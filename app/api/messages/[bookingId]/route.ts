import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await serverSupabase
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;
    const { message, receiverId } = await req.json();
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await serverSupabase
      .from('messages')
      .insert([
        {
          booking_id: bookingId,
          sender_id: user.id,
          receiver_id: receiverId,
          message: message,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
