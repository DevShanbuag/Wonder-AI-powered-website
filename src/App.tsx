'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConnectivityBanner from "@/components/ConnectivityBanner";
import Index from "./views/Index";
import ListingsPage from "./views/ListingsPage";
import ListingDetailPage from "./views/ListingDetailPage";
import FavoritesPage from "./views/FavoritesPage";
import LoginPage from "./views/LoginPage";
import SignupPage from "./views/SignupPage";
import AboutPage from "./views/AboutPage";
import BookingsPage from "./views/BookingsPage";
import ProfilePage from "./views/ProfilePage";
import ProfileSettingsPage from "./views/ProfileSettingsPage";
import ViewProfilePage from "./views/ViewProfilePage";
import LegalPage from "./views/LegalPage";
import HelpPage from "./views/HelpPage";
import PrivacyPage from "./views/PrivacyPage";
import ReferHostPage from "./views/ReferHostPage";
import CoHostPage from "./views/CoHostPage";
import AdminMediaPage from "./views/AdminMediaPage";
import HostAvailabilityPage from "./views/HostAvailabilityPage";
import OwnerDashboard from "./views/OwnerDashboard";
import AddResortPage from "./views/AddResortPage";
import NotFound from "./views/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsent from "react-cookie-consent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CurrencyProvider>
          <FavoritesProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <ErrorBoundary>
                <div className="min-h-screen flex flex-col">
                  <ConnectivityBanner />
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/listing" element={<Navigate to="/listings" replace />} />
                      <Route path="/listings" element={<ListingsPage />} />
                      <Route path="/listings/:id" element={<ListingDetailPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/bookings" element={<BookingsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/profile/settings" element={<ProfileSettingsPage />} />
                      <Route path="/profile/view" element={<ViewProfilePage />} />
                      <Route path="/legal" element={<LegalPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/refer" element={<ReferHostPage />} />
                      <Route path="/co-host" element={<CoHostPage />} />
                      <Route path="/admin/media" element={<AdminMediaPage />} />
                      <Route path="/host/availability" element={<HostAvailabilityPage />} />
                      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                      <Route path="/owner/add-resort" element={<AddResortPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <CookieConsent
                    location="bottom"
                    buttonText="Got it!"
                    cookieName="wonderstayCookieConsent"
                    style={{ background: "#1f2937", color: "#f9fafb" }}
                    buttonStyle={{ color: "#1f2937", fontSize: "14px", background: "#f9fafb", borderRadius: "4px" }}
                    expires={150}
                  >
                    Our website uses cookies to make your experience better, tastier, and less crumbly. By continuing, you agree to our cookie policy.
                  </CookieConsent>
                </div>
              </ErrorBoundary>
            </BrowserRouter>
          </FavoritesProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
