import { motion } from "framer-motion";
import { ArrowLeft, Users, Key, Calendar, MessageCircle, Star, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CoHostPage() {
  const coHosts = [
    {
      name: "Priya Sharma",
      location: "Goa, India",
      rating: 4.9,
      reviews: 84,
      experience: "5+ years",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    {
      name: "Rahul Verma",
      location: "Manali, India",
      rating: 4.8,
      reviews: 62,
      experience: "3+ years",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
    },
    {
      name: "Anjali Gupta",
      location: "Kerala, India",
      rating: 5.0,
      reviews: 45,
      experience: "4+ years",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali"
    }
  ];

  const benefits = [
    { title: "Key Management", icon: <Key className="w-5 h-5 text-primary" />, desc: "Handle check-ins and check-outs seamlessly." },
    { title: "Cleaning Service", icon: <ShieldCheck className="w-5 h-5 text-primary" />, desc: "Ensure your property is always guest-ready." },
    { title: "Guest Support", icon: <MessageCircle className="w-5 h-5 text-primary" />, desc: "Respond to guest inquiries 24/7." },
    { title: "Booking Management", icon: <Calendar className="w-5 h-5 text-primary" />, desc: "Manage your calendar and pricing dynamically." }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center gap-4 shadow-sm">
        <Link to="/profile" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display">Find a Co-Host</h1>
      </header>

      <div className="page-wrapper py-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-bold font-display">Earn more, host less</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Connect with experienced co-hosts who can help you manage your property, 
            provide exceptional guest experiences, and maximize your earnings.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="border-none bg-muted/30 p-6 text-center space-y-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-sm">{benefit.title}</h3>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{benefit.desc}</p>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold font-display">Top Co-Hosts in India</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="grid gap-4">
            {coHosts.map((host, index) => (
              <motion.div
                key={host.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="border border-border/50 hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                  <CardContent className="p-6 flex items-center gap-6">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarImage src={host.avatar} />
                      <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-lg">{host.name}</h4>
                        <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-primary" /> {host.rating}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{host.location} • {host.experience} exp.</p>
                      <p className="text-xs text-muted-foreground/80">{host.reviews} successful stays managed</p>
                    </div>
                    <button className="btn-outline px-6 py-2 rounded-xl font-bold text-sm">
                      Contact
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-10 bg-muted/30 rounded-[2.5rem] border border-border/50 text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-display">Are you an expert host?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Help other owners succeed and earn a share of the booking revenue by becoming a co-host.
            </p>
          </div>
          <button className="btn-primary px-10 py-3 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
            Join as Co-Host
          </button>
        </div>
      </div>
    </div>
  );
}
