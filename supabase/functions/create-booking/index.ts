import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { listing_id, check_in, check_out, guests, total_price, user_id } = await req.json()

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: existingBookings, error: existingBookingsError } = await supabase
      .from('bookings')
      .select('check_in, check_out')
      .eq('listing_id', listing_id)
      .in('status', ['confirmed', 'completed', 'upcoming', 'ongoing']);

    if (existingBookingsError) {
      throw existingBookingsError;
    }

    const newBookingStart = new Date(check_in).getTime();
    const newBookingEnd = new Date(check_out).getTime();

    const isOverlapping = existingBookings.some(booking => {
      const existingStart = new Date(booking.check_in).getTime();
      const existingEnd = new Date(booking.check_out).getTime();
      return newBookingStart < existingEnd && newBookingEnd > existingStart;
    });

    if (isOverlapping) {
      return new Response(JSON.stringify({ error: "Dates overlap with an existing booking." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{ listing_id, check_in, check_out, guests, total_price, user_id, status: 'confirmed' }])
      .select();

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
})
