import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { listing_id, start_date, end_date, guests, total } = body;

    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }

    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await serverSupabase.functions.invoke('create-booking', {
      body: { listing_id, start_date, end_date, guests, total, user_id: user.id },
    });

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
