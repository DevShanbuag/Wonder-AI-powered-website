import { useState, useMemo, useCallback } from "react";
import { CalendarDays, Users, ArrowRight, ShieldCheck, Info, CreditCard, Star, ChevronDown, Plus, Minus } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";
import { createBooking, getListingBookings } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { computeNextAvailable } from "@/lib/date-range";
import { createClient } from "@/utils/supabase/client";
import { useNavigate } from "react-router-dom";
import { createRazorpayOrder, openRazorpayCheckout } from "@/lib/razorpay";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format as formatDate } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingWidgetProps {
  pricePerNight: number;
  maxGuests: number;
  listingId: string;
  externalRange?: DateRange;
  showCalendar?: boolean;
}

export default function BookingWidget({ pricePerNight, maxGuests, listingId, externalRange, showCalendar = true }: BookingWidgetProps) {
  const supabase = createClient();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isReserving, setIsReserving] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: bookings = [] } = useQuery({
    queryKey: ["listing_bookings", listingId],
    queryFn: () => getListingBookings(listingId),
    enabled: Boolean(listingId),
  });

  const rangeSelected = useMemo(() => {
    if (externalRange && externalRange.from) {
      return externalRange;
    }
    if (checkIn && checkOut) {
      return { from: new Date(checkIn), to: new Date(checkOut) };
    }
    return undefined;
  }, [externalRange, checkIn, checkOut]);

  const isDateDisabled = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    return bookings.some(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      return date >= start && date < end;
    });
  }, [bookings]);

  const effCheckIn = rangeSelected?.from ? formatDate(rangeSelected.from, "MMM d, yyyy") : "";
  const effCheckOut = rangeSelected?.to ? formatDate(rangeSelected.to, "MMM d, yyyy") : "";
  
  const nights = useMemo(() => {
    if (!rangeSelected?.from || !rangeSelected?.to) return 0;
    const diff = rangeSelected.to.getTime() - rangeSelected.from.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [rangeSelected]);

  const basePrice = nights * pricePerNight;
  const serviceFee = Math.round(basePrice * 0.12);
  const taxes = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + serviceFee + taxes;

  const handleReserve = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please sign in to make a booking");
      navigate("/login");
      return;
    }

    if (!rangeSelected?.from || !rangeSelected?.to) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (nights <= 0) {
      toast.error("Invalid date range");
      return;
    }

    setIsReserving(true);
    try {
      const { data: availability, error: availabilityError } = await supabase
        .rpc('check_resort_availability', {
          resort_id: listingId,
          checkin_date: rangeSelected.from.toISOString().slice(0, 10),
          checkout_date: rangeSelected.to.toISOString().slice(0, 10)
        });

      if (availabilityError || !availability) {
        toast.error("Resort not available for selected dates. Please choose different dates.");
        return;
      }

      const res = await createBooking({
        listingId,
        title: "",
        image: "",
        location: "",
        country: "",
        startDate: rangeSelected.from.toISOString().slice(0, 10),
        endDate: rangeSelected.to.toISOString().slice(0, 10),
        guests,
        total: totalPrice,
        status: "pending",
      });

      if (!res.ok) {
        toast.error(res.error || "Could not create booking");
        return;
      }

      const order = await createRazorpayOrder({
        bookingId: res.id || "",
        amount: totalPrice,
      });

      await openRazorpayCheckout(order.id, totalPrice, res.id || "");
      
      toast.success("Payment successful! Booking confirmed.");
      queryClient.invalidateQueries({ queryKey: ["listing_bookings", listingId] });
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      navigate("/bookings");
    } catch (err) {
      const error = err as Error;
      console.error("Booking error:", error);
      if (error.message?.includes("available")) {
        toast.error("Resort not available for selected dates. Please choose different dates.");
      } else if (error.message?.includes("Unauthorized")) {
        toast.error("Please sign in to make a booking");
        navigate("/login");
      } else if (error.message?.includes("cancelled")) {
        toast.error("Payment was cancelled");
      } else {
        toast.error(error.message || "Failed to process payment");
      }
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <div className="booking-card bg-card border border-border shadow-xl p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-bold">{format(pricePerNight)}</span>
          <span className="text-muted-foreground font-medium"> / night</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span>New</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="rounded-xl border border-border overflow-hidden">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="grid grid-cols-2 border-b border-border cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="p-3 border-r border-border">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Check-in</label>
                  <div className="text-sm font-medium">{effCheckIn || "Add date"}</div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Check-out</label>
                  <div className="text-sm font-medium">{effCheckOut || "Add date"}</div>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={rangeSelected}
                onSelect={(r: DateRange | undefined) => {
                  if (r?.from) setCheckIn(r.from.toISOString().slice(0, 10));
                  else setCheckIn("");
                  if (r?.to) setCheckOut(r.to.toISOString().slice(0, 10));
                  else setCheckOut("");
                }}
                disabled={isDateDisabled}
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>

          <div className="p-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Guests</label>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium">{guests} guest{guests > 1 ? "s" : ""}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={guests <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGuests(Math.min(maxGuests, guests + 1))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={guests >= maxGuests}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleReserve} 
        disabled={isReserving}
        className="btn-primary w-full py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isReserving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Pay & Confirm Booking
          </>
        )}
      </button>

      <p className="text-center text-sm text-muted-foreground mt-4">You won't be charged yet</p>

      {nights > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-base">
            <span className="underline text-muted-foreground">{format(pricePerNight)} × {nights} nights</span>
            <span>{format(basePrice)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="underline text-muted-foreground">WonderStay service fee</span>
            <span>{format(serviceFee)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="underline text-muted-foreground">Taxes</span>
            <span>{format(taxes)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-4 border-t border-border mt-4">
            <span>Total</span>
            <span>{format(totalPrice)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-border flex gap-4 items-start">
        <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
        <div className="text-xs">
          <p className="font-bold mb-1 uppercase tracking-widest text-primary">WonderCover</p>
          <p className="text-muted-foreground leading-relaxed">Your booking is protected by WonderCover. We ensure a safe stay and easy cancellations.</p>
        </div>
      </div>
    </div>
  );
}
