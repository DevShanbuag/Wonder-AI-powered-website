import { NextResponse } from 'next/server';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const { listingId } = params;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ canViewContact: false }, { status: 200 });
    }

    const { data, error } = await supabase
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
