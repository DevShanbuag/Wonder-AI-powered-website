export type Category = "Mountain" | "Treehouse" | "Desert" | "Island" | "BeachFront" | "Hill Station" | "Others";
export type Season = "Winter" | "Summer" | "Monsoon" | "All";
export type Currency = "INR" | "USD" | "EUR" | "GBP";
export type SortOption = "price_asc" | "price_desc" | "rating_asc" | "rating_desc" | "newest";
export type BookingStatus = "pending" | "confirmed" | "upcoming" | "ongoing" | "completed" | "cancelled";

export interface TransportInfo {
  railway?: string;
  bus?: string;
  airport?: string;
}

export interface HostContact {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  price: number; // INR
  location: string;
  country: string;
  category: Category;
  season: Season;
  amenities: string[];
  capacity: { guests: number; beds: number; baths: number };
  avgRating: number;
  reviewCount: number;
  owner: { id?: string; name: string; avatarUrl?: string };
  coordinates: [number, number]; // [lng, lat]
  isFavorite?: boolean;
  transportInfo?: TransportInfo;
  hostContact?: HostContact;
  canViewContact?: boolean;
}

export interface Review {
  id: string;
  bookingId?: string;
  resortId?: string;
  userId?: string;
  comment: string;
  rating: number;
  author?: { name: string; avatarUrl?: string };
  createdAt: string;
}

export interface FiltersState {
  category?: Category;
  season?: Season;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort: SortOption;
  page: number;
  search?: string;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export const CURRENCY_RATES: Record<Currency, number> = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const CATEGORIES: Category[] = ["Mountain", "Treehouse", "Desert", "Island", "BeachFront", "Hill Station", "Others"];
export const SEASONS: Season[] = ["Winter", "Summer", "Monsoon", "All"];
export const AMENITIES = ["WiFi", "AC", "Pool", "Breakfast", "Parking", "TV", "Kitchen", "Gym", "Spa", "Pet Friendly", "Fireplace", "Garden"] as const;
export type Amenity = typeof AMENITIES[number];
