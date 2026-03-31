import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, X, User, Search, Moon, Sun, Hotel, Globe, Briefcase, MapPin, Calendar as CalendarIcon, Users } from "lucide-react";
import { useTheme } from "next-themes";
import CurrencySelector from "@/components/CurrencySelector";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import LocationSearch from "@/components/LocationSearch";

export default function Navbar() {
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Search states
  const [searchLocation, setSearchLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [guests, setGuests] = useState(1);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const isTransparent = location.pathname === "/" && !scrolled;

  const userInitial = user?.email?.[0].toUpperCase() || "U";
  const isOwner = user?.user_metadata?.role === "owner";

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) {
      params.set("location", searchLocation.name);
      params.set("lat", searchLocation.lat.toString());
      params.set("lon", searchLocation.lon.toString());
    }
    if (dateRange.from) params.set("from", dateRange.from.toISOString());
    if (dateRange.to) params.set("to", dateRange.to.toISOString());
    if (guests > 1) params.set("guests", guests.toString());

    setIsSearchDialogOpen(false);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/80 backdrop-blur-md border-b border-border py-3 shadow-sm" : "bg-background py-5"
    }`}>
      <div className="page-wrapper flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Hotel className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
            Wonder<span className="text-primary">Stay</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/listings" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === "/listings" ? "text-primary" : "text-muted-foreground"}`}>
            Explore
          </Link>
          <Link to="/bookings" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === "/bookings" ? "text-primary" : "text-muted-foreground"}`}>
            Bookings
          </Link>
          {isOwner && (
            <>
              <Link to="/owner/dashboard" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === "/owner/dashboard" ? "text-primary" : "text-muted-foreground"}`}>
                Dashboard
              </Link>
              <Link to="/owner/add-resort" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === "/owner/add-resort" ? "text-primary" : "text-muted-foreground"}`}>
                Add Resort
              </Link>
            </>
          )}
          <Link to="/about" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === "/about" ? "text-primary" : "text-muted-foreground"}`}>
            About
          </Link>
        </div>

        {/* Center Search Bar (Airbnb style) - Only on listings page or home */}
        {(location.pathname === "/" || location.pathname === "/listings") && (
          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
              <div className="hidden md:flex lg:hidden xl:flex items-center border border-border rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all cursor-pointer bg-card group">
                <button className="px-4 text-sm font-semibold border-r border-border truncate max-w-[120px]">
                  {searchLocation?.name || "Anywhere"}
                </button>
                <button className="px-4 text-sm font-semibold border-r border-border truncate max-w-[120px]">
                  {dateRange.from ? format(dateRange.from, "MMM d") : "Any week"}
                </button>
                <button className="px-4 text-sm font-medium text-muted-foreground truncate max-w-[100px]">
                  {guests > 1 ? `${guests} guests` : "Add guests"}
                </button>
                <div className="ml-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-sm">
              <DialogHeader className="p-6 border-b border-border bg-muted/30">
                <DialogTitle className="text-2xl font-bold font-display text-center">Search WonderStay</DialogTitle>
              </DialogHeader>
              <div className="p-8 space-y-8">
                {/* Location Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground/70 px-1 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-primary" />
                    Where to?
                  </div>
                  <LocationSearch 
                    onLocationSelect={(loc) => setSearchLocation(loc)} 
                    placeholder="Search destinations in India..."
                  />
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/70 px-1 uppercase tracking-wider">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      When?
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 rounded-xl border-border bg-muted/50 hover:bg-muted transition-colors",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd")} -{" "}
                                {format(dateRange.to, "LLL dd")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-none shadow-2xl" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          selected={{ from: dateRange.from, to: dateRange.to }}
                          onSelect={(range: any) => setDateRange({ from: range?.from, to: range?.to })}
                          numberOfMonths={2}
                          className="bg-background"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Guests Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-foreground/70 px-1 uppercase tracking-wider">
                      <Users className="w-4 h-4 text-primary" />
                      Who?
                    </div>
                    <div className="flex items-center justify-between h-12 px-4 rounded-xl border border-border bg-muted/50">
                      <span className="text-sm font-medium">{guests} Guests</span>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
                          disabled={guests <= 1}
                        >
                          -
                        </button>
                        <button 
                          onClick={() => setGuests(guests + 1)}
                          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all active:scale-[0.99]"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Stays
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!isOwner && user && (
            <Link 
              to="/owner/dashboard" 
              className="hidden md:flex items-center gap-2 text-sm font-semibold hover:bg-muted px-4 py-2.5 rounded-full transition-colors"
            >
              Become a Host
            </Link>
          )}
          
          <div className="flex items-center gap-1 border border-border rounded-full p-1.5 hover:shadow-md transition-all bg-card">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <Link
              to="/favorites"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative"
              aria-label="Favorites"
            >
              <Heart className="w-4 h-4" />
            </Link>

            <div className="h-6 w-[1px] bg-border mx-1"></div>

            <div className="relative group">
              <Link
                to="/profile"
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-muted transition-colors"
              >
                <Menu className="w-4 h-4 text-muted-foreground" />
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 overflow-hidden">
                  {user ? (
                    <span className="font-bold text-xs">{userInitial}</span>
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
              </Link>
              
              {/* Dropdown Menu (Simplified) */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-background border border-border rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm font-semibold hover:bg-muted">Sign in</Link>
                    <Link to="/signup" className="block px-4 py-2 text-sm hover:bg-muted">Sign up</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="block px-4 py-2 text-sm font-semibold hover:bg-muted">My Profile</Link>
                    <Link to="/bookings" className="block px-4 py-2 text-sm hover:bg-muted">My Bookings</Link>
                    <div className="h-[1px] bg-border my-1"></div>
                    <Link to="/owner/dashboard" className="block px-4 py-2 text-sm hover:bg-muted">Manage Listings</Link>
                    <button 
                      onClick={() => supabase.auth.signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/5"
                    >
                      Log out
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
