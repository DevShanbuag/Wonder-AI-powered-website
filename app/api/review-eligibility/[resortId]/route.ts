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
      .select('id, listing_id, status, check_out')
      .eq('user_id', user.id)
      .eq('listing_id', resortId)
      .eq('status', 'completed')
      .lt('check_out', new Date().toISOString());

    if (error) {
      console.error('Supabase error in review-eligibility:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter out bookings that already have reviews in memory
    const eligibleBookings = (data || []);

    return NextResponse.json(eligibleBookings, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
