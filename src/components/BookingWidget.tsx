import { useState, useMemo, useCallback } from "react";
import { CalendarDays, Users, ArrowRight, ShieldCheck, Info, CreditCard, Star, ChevronDown, Plus, Minus, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";
import { createBooking, getListingBookings } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { computeNextAvailable } from "@/lib/date-range";
import { createClient } from "@/utils/supabase/client";
import { useNavigate } from "react-router-dom";
import { createRazorpayOrder, openRazorpayCheckout, verifyRazorpayPayment } from "@/lib/razorpay";
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
  
  const [range, setRange] = useState<DateRange | undefined>(externalRange);
  const [guests, setGuests] = useState(1);
  const [isReserving, setIsReserving] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { data: bookings = [] } = useQuery({
    queryKey: ["listing_bookings", listingId],
    queryFn: () => getListingBookings(listingId),
    enabled: Boolean(listingId),
  });

  const rangeSelected = range || externalRange;

  const isDateDisabled = useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return true;

    return bookings.some(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
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

    setIsReserving(true);
    
    try {
      // 1. Create Order on Backend
      const { order_id, amount: orderAmount } = await createRazorpayOrder({
        amount: totalPrice,
        metadata: {
          listingId,
          checkIn: rangeSelected.from!.toISOString(),
          checkOut: rangeSelected.to!.toISOString(),
          guests
        }
      });

      // 2. Open Razorpay Checkout Modal
      await openRazorpayCheckout(
        order_id, 
        orderAmount, 
        async (response) => {
          // 3. Verify Payment on Backend
          const verification = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (!verification.success) {
            throw new Error("Payment verification failed");
          }

          // 4. Create Booking in Supabase
          const { error: insertError } = await supabase
            .from("bookings")
            .insert([{
              user_id: session.user.id,
              listing_id: listingId,
              check_in: rangeSelected.from!.toISOString().slice(0, 10),
              check_out: rangeSelected.to!.toISOString().slice(0, 10),
              guests: guests,
              total_price: totalPrice,
              payment_id: response.razorpay_payment_id,
              status: "confirmed"
            }]);

          if (insertError) {
            console.error("Database save failed:", insertError);
            throw new Error(insertError.message);
          }

          toast.success("Booking Confirmed!");
          
          // Invalidate queries to reflect in real-time
          await queryClient.invalidateQueries({ queryKey: ["listing_bookings", listingId] });
          await queryClient.invalidateQueries({ queryKey: ["userBookings"] });
          
          // Redirect to success page with booking details
          setTimeout(() => {
            navigate("/booking-success", { 
              state: {
                checkIn: rangeSelected.from!.toISOString(),
                checkOut: rangeSelected.to!.toISOString(),
                guests: guests,
                totalPrice: totalPrice,
                listingId: listingId
              }
            });
          }, 1000);
        },
        {
          name: session.user.user_metadata?.full_name || "",
          email: session.user.email || ""
        }
      );

    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error(err.message || "Failed to process booking");
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
                  setRange(r);
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
        className={cn(
          "w-full py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2",
          isReserving ? "bg-green-500 text-white" : "btn-primary shadow-primary/20 hover:translate-y-[-2px]"
        )}
      >
        {isReserving ? (
          <>
            <CheckCircle2 className="h-5 w-5 animate-bounce" />
            Booking Confirmed!
          </>
        ) : (
          <>
            <CreditCard className="h-4 w-4" />
            Pay & Confirm Booking
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
        <span>Powered by</span>
        <span className="font-bold text-primary">Razorpay</span>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2">You won't be charged yet</p>


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
        <div className="text-xs flex-1">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold uppercase tracking-widest text-primary">WonderCover</p>
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-1 hover:bg-muted rounded-full transition-colors">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 text-xs" side="top">
                <p className="font-semibold mb-1">Protection Policy</p>
                <p className="text-muted-foreground">Refund within 48 hours for ill listings and host issues.</p>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-muted-foreground leading-relaxed">Your booking is protected by WonderCover. We ensure a safe stay and easy cancellations.</p>
        </div>
      </div>
    </div>
  );
}
