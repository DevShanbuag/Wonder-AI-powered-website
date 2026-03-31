import { motion } from "framer-motion";
import { ArrowLeft, Star, ShieldCheck, MapPin, Calendar, MessageSquare, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthUser } from "@/hooks/useAuth";

export default function ViewProfilePage() {
  const { user, profile } = useAuthUser();
  const name = profile?.full_name || user?.email?.split('@')[0] || "Guest";
  const initial = name.charAt(0).toUpperCase();

  const stats = [
    { label: "Reviews", value: "12", icon: <Star className="w-4 h-4" /> },
    { label: "Years on Wonderstay", value: "2", icon: <Calendar className="w-4 h-4" /> },
    { label: "Verified", value: "Yes", icon: <ShieldCheck className="w-4 h-4 text-green-500" /> }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center gap-4 shadow-sm">
        <Link to="/profile" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display">View Profile</h1>
      </header>

      <div className="page-wrapper py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-1"
          >
            <Card className="border border-border/50 shadow-lg rounded-3xl overflow-hidden">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">{initial}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" /> India
                  </p>
                </div>
                <div className="flex gap-4 w-full pt-4 border-t border-border/50">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex-1 text-center">
                      <div className="flex items-center justify-center gap-1 font-bold text-lg">
                        {stat.icon} {stat.value}
                      </div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Details Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="md:col-span-2 space-y-8"
          >
            <section className="space-y-4">
              <h3 className="text-2xl font-bold font-display">About {name}</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Hi! I'm {name}. I love traveling and discovering unique stays across India. 
                I value comfort, authenticity, and great hospitality. 
                Looking forward to my next adventure with Wonderstay!
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold font-display flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Verified Info
              </h3>
              <ul className="grid gap-3">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Email address verified
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Phone number verified
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Government ID verified
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold font-display flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" /> Recent Reviews
              </h3>
              <div className="p-12 bg-muted/20 rounded-3xl border border-dashed border-border text-center">
                <p className="text-muted-foreground font-medium italic">"No reviews from hosts yet. Once you complete a stay, your reviews will appear here."</p>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
