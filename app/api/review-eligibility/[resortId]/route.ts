import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { resortId: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { resortId } = params;

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(resortId)) {
      return NextResponse.json([], { status: 200 }); // Return empty if invalid ID
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id, listing_id, status, end_date, reviews(id)')
      .eq('user_id', user.id)
      .eq('listing_id', resortId)
      .eq('status', 'completed')
      .lt('end_date', new Date().toISOString());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out bookings that already have reviews in memory
    // (Filtering on joined table absence can be tricky in Supabase PostgREST)
    const eligibleBookings = (data || []).filter(booking => !booking.reviews || (Array.isArray(booking.reviews) && booking.reviews.length === 0));

    return NextResponse.json(eligibleBookings, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
