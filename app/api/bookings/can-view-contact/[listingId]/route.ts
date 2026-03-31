import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const { listingId } = params;
    if (!serverSupabase) {
      return NextResponse.json({ canViewContact: false }, { status: 200 });
    }
    const { data: { user } } = await serverSupabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ canViewContact: false }, { status: 200 });
    }

    const { data, error } = await serverSupabase
      .from('bookings')
      .select('id')
      .eq('listing_id', listingId)
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ canViewContact: data && data.length > 0 }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
