export type BookingStatus = "pending" | "confirmed" | "upcoming" | "ongoing" | "completed" | "cancelled";

export interface Booking {
  id: string;
  listingId: string;
  title: string;
  image: string;
  location: string;
  country: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  paymentId?: string;
  cancellationReason?: string;
}

import { mockListings } from "./mock-data";

const l1 = mockListings[0];
const l2 = mockListings[1];
const l3 = mockListings[2];
const l4 = mockListings[3];

import { addDays, subDays, format } from "date-fns";

const today = new Date();
const formatDateStr = (date: Date) => format(date, "yyyy-MM-dd");

export const mockBookings: Booking[] = [
  {
    id: "b1",
    listingId: l2.id,
    title: l2.title,
    image: l2.image,
    location: l2.location,
    country: l2.country,
    checkIn: formatDateStr(addDays(today, 5)),
    checkOut: formatDateStr(addDays(today, 9)),
    guests: 2,
    totalPrice: 60000,
    status: "upcoming",
  },
  {
    id: "b2",
    listingId: l1.id,
    title: l1.title,
    image: l1.image,
    location: l1.location,
    country: l1.country,
    checkIn: formatDateStr(subDays(today, 2)),
    checkOut: formatDateStr(addDays(today, 3)),
    guests: 4,
    totalPrice: 42000,
    status: "ongoing",
  },
  {
    id: "b3",
    listingId: l3.id,
    title: l3.title,
    image: l3.image,
    location: l3.location,
    country: l3.country,
    checkIn: formatDateStr(subDays(today, 15)),
    checkOut: formatDateStr(subDays(today, 12)),
    guests: 2,
    totalPrice: 15000,
    status: "completed",
  },
  {
    id: "b4",
    listingId: l4.id,
    title: l4.title,
    image: l4.image,
    location: l4.location,
    country: l4.country,
    checkIn: formatDateStr(addDays(today, 10)),
    checkOut: formatDateStr(addDays(today, 15)),
    guests: 2,
    totalPrice: 90000,
    status: "cancelled",
    cancellationReason: "Change of plans",
  },
];
