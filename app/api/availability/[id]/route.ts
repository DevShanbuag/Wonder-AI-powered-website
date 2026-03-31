import { NextResponse } from 'next/server';
import { serverSupabase } from 'src/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }
    const { data, error } = await serverSupabase
      .from('bookings')
      .select('start_date,end_date,status')
      .eq('listing_id', params.id)
      .in('status', ['confirmed', 'upcoming', 'ongoing'])
      .order('start_date', { ascending: true });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const windows = (data ?? []).map((b: { start_date: string; end_date: string }) => ({
      start_date: b.start_date,
      end_date: b.end_date,
    }));
    return NextResponse.json({ windows }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
