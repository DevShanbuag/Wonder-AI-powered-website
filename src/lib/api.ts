import { createClient } from "@/utils/supabase/client";

import { mockListings, mockReviews } from "./mock-data";
import type { Listing, Review, Category, Season, BookingStatus } from "./types";
import { mockBookings, type Booking } from "./bookings";

const supabase = createClient();

interface TransportInfo {
  railway?: string;
  bus?: string;
  airport?: string;
}

interface Resort {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  price: number;
  location: string;
  country: string;
  category: Category;
  season: Season;
  amenities: string[];
  capacity_guests: number;
  capacity_beds: number;
  capacity_baths: number;
  avg_rating: number;
  review_count: number;
  owner_name: string;
  coordinates: [number, number];
  transport_info: TransportInfo;
  host_phone?: string;
  host_email?: string;
  host_whatsapp?: string;
  can_view_contact?: boolean;
}

function mapResortToListing(data: Resort): Listing {
  const g = Array.isArray(data.gallery) ? data.gallery.filter(Boolean) : [];
  let gallery = g.length ? g : (data.image ? [data.image] : []);
  
  // Only fill if we have at least one image to replicate
  if (gallery.length > 0) {
    while (gallery.length < 5) gallery.push(gallery[0]);
  }
  
  if (gallery.length > 20) gallery = gallery.slice(0, 20);

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    image: data.image,
    gallery: gallery,
    price: data.price,
    location: data.location,
    country: data.country || "India",
    category: data.category,
    season: data.season,
    amenities: data.amenities || [],
    capacity: {
      guests: data.capacity_guests,
      beds: data.capacity_beds,
      baths: data.capacity_baths,
    },
    avgRating: Number(data.avg_rating) || 0,
    reviewCount: data.review_count || 0,
    owner: {
      name: data.owner_name,
    },
    // Standardize to [lat, lng] for Leaflet
    // Since India's longitude (68-97) is always greater than its latitude (8-37),
    // we can auto-detect and swap if the first coordinate is larger.
    coordinates: data.coordinates[0] > data.coordinates[1]
      ? [data.coordinates[1], data.coordinates[0]] as [number, number]
      : data.coordinates as [number, number],
    transportInfo: data.transport_info,
    hostContact: {
      phone: data.host_phone,
      email: data.host_email,
      whatsapp: data.host_whatsapp,
    },
    canViewContact: data.can_view_contact,
  };
}

export async function getListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase.from("resorts").select("*").order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map(mapResortToListing);
    }
  } catch (err) {
    console.error("Error fetching listings from Supabase:", err);
  }
  
  // Fallback to mock data if Supabase fails or is empty
  return mockListings.map(l => ({
    ...l,
    // Ensure coordinates are [lat, lng]. If first value > second, it's likely [lng, lat]
    coordinates: l.coordinates[0] > l.coordinates[1] 
      ? [l.coordinates[1], l.coordinates[0]] as [number, number]
      : l.coordinates
  }));
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    // Try to fetch from the view first (includes contact info logic)
    const { data, error } = await supabase.from("resorts_with_contact").select("*").eq("id", id).maybeSingle();
    
    if (!error && data) {
      return mapResortToListing(data);
    }

    // If view fails or is missing, try fetching from the main resorts table
    const { data: resortData, error: resortError } = await supabase.from("resorts").select("*").eq("id", id).maybeSingle();
    if (!resortError && resortData) {
      return mapResortToListing(resortData);
    }
  } catch (err) {
    console.error("Error fetching listing from Supabase:", err);
  }

  // Fallback to mock data
  const mock = mockListings.find(l => l.id === id);
  if (!mock) return null;
  
  return {
    ...mock,
    // Ensure coordinates are [lat, lng]
    coordinates: mock.coordinates[0] > mock.coordinates[1]
      ? [mock.coordinates[1], mock.coordinates[0]] as [number, number]
      : mock.coordinates
  };
}

export async function getReviews(listingId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase.from("reviews_with_profiles").select("*").eq("resort_id", listingId).order("created_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map((r: any) => ({
        id: r.id,
        user: {
          name: r.full_name || "Guest",
          avatarUrl: r.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user_id}`
        },
        rating: r.rating,
        comment: r.comment,
        createdAt: r.created_at
      }));
    }
  } catch (err) {
    console.error("Error fetching reviews from Supabase:", err);
  }
  return mockReviews;
}

export async function getBookings(): Promise<Booking[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        resorts (
          title,
          location,
          image
        )
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map((b: any) => ({
        id: b.id,
        listingId: b.listing_id,
        title: b.resorts?.title || "Resort",
        location: b.resorts?.location || "India",
        image: b.resorts?.image || "",
        country: "India",
        checkIn: b.check_in,
        checkOut: b.check_out,
        guests: b.guests,
        totalPrice: b.total_price,
        status: b.status as any,
        paymentId: b.payment_id,
        cancellationReason: b.cancellation_reason
      }));
    }
  } catch (err) {
    console.error("Error fetching bookings from Supabase:", err);
  }
  return [];
}

export async function getListingBookings(listingId: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("listing_id", listingId)
      .neq("status", "cancelled");
      
    if (error || !data) return [];
    return data.map(d => ({
      id: d.id,
      listingId: d.listing_id,
      title: "", // Not needed for availability check
      image: "",
      location: "",
      country: "",
      checkIn: d.check_in,
      checkOut: d.check_out,
      guests: d.guests,
      totalPrice: d.total_price,
      status: d.status,
      paymentId: d.payment_id
    }));
  } catch (err) {
    console.error("Error fetching listing bookings:", err);
    return [];
  }
}

export async function createReview(input: { listing_id: string; booking_id: string; comment: string; rating: number }): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc('add_review', {
      booking_id: input.booking_id,
      rating: input.rating,
      comment: input.comment
    });
    
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "failed_to_create_review" };
  }
}

export async function createBooking(payload: Omit<Booking, "id" | "status" | "createdAt" | "userId"> & { status?: BookingStatus }): Promise<{ ok: boolean; id?: string; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token || ''}`
      },
      body: JSON.stringify({
        listing_id: payload.listingId,
        check_in: payload.checkIn,
        check_out: payload.checkOut,
        guests: payload.guests,
        total_price: payload.totalPrice,
        status: payload.status ?? "confirmed",
      }),
    });
    const j = await res.json().catch(() => ({}));
    if (res.status === 201) {
      return { ok: true, id: j.id };
    }
    if (res.status === 409) {
      return { ok: false, error: j.error || "booking_conflict" };
    }
    return { ok: false, error: j.error || "booking_failed" };
  } catch (e) {
    const error = e as Error;
    return { ok: false, error: error.message || "booking_failed" };
  }
}

export async function sendBookingRequest(input: { listing_id: string; check_in: string; check_out: string; guests: number }): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("booking_requests").insert([input]);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "failed_to_send_request" };
  }
}
