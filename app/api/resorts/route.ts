import { NextResponse } from 'next/server';
import { serverSupabase } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/resorts
 * Fetches all resorts from the 'resorts' table in Supabase.
 */
export async function GET() {
  try {
    if (!serverSupabase) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }
    const { data, error } = await serverSupabase
      .from('resorts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
