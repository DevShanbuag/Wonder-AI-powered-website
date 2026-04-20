import { motion } from "framer-motion";
import { CheckCircle2, Calendar, MapPin, ArrowRight, Home } from "lucide-react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format as formatDate } from "date-fns";

export default function BookingSuccessPage() {
  const location = useLocation();
  const bookingData = location.state as {
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    listingId: string;
  } | null;

  if (!bookingData) {
    return <Navigate to="/bookings" replace />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
          <div className="bg-primary p-8 text-center text-primary-foreground">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2 font-display">Booking Confirmed!</h1>
            <p className="text-primary-foreground/80">Pack your bags, you're going away!</p>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Stay Dates</p>
                  <p className="text-sm font-semibold">
                    {formatDate(new Date(bookingData.checkIn), "MMM d")} - {formatDate(new Date(bookingData.checkOut), "MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Guests</p>
                  <p className="text-sm font-semibold">{bookingData.guests} Guest{bookingData.guests > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex flex-col gap-3">
              <Button asChild className="w-full py-6 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                <Link to="/bookings">
                  View My Bookings
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full py-6 rounded-2xl font-medium">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
