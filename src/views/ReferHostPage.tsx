import { motion } from "framer-motion";
import { ArrowLeft, Gift, Share2, Users, IndianRupee, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function ReferHostPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "WONDER-HOST-2026";

  const steps = [
    {
      title: "Share your code",
      icon: <Share2 className="w-6 h-6 text-primary" />,
      desc: "Send your unique referral link to friends who have a beautiful property to share."
    },
    {
      title: "They list their stay",
      icon: <IndianRupee className="w-6 h-6 text-primary" />,
      desc: "When they complete their first booking, they'll get a ₹1,000 bonus."
    },
    {
      title: "You get rewarded",
      icon: <Gift className="w-6 h-6 text-primary" />,
      desc: "You'll earn ₹2,000 in travel credits for every successful referral."
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center gap-4 shadow-sm">
        <Link to="/profile" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display">Refer a host</h1>
      </header>

      <div className="page-wrapper py-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-white shadow-xl"
        >
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold font-display">Give ₹1,000, Get ₹2,000</h2>
            <p className="text-primary-foreground/90 max-w-md text-lg">
              Help your friends become hosts and earn travel credits for your next adventure.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                <span className="font-mono font-bold tracking-wider">{referralCode}</span>
                <button 
                  onClick={handleCopy}
                  className="p-1 hover:bg-white/20 rounded-md transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <button className="bg-white text-primary px-6 py-2 rounded-xl font-bold hover:bg-white/90 transition-colors">
                Share Link
              </button>
            </div>
          </div>
          <Gift className="absolute -bottom-4 -right-4 w-48 h-48 text-white/10 rotate-12" />
        </motion.div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-center">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
              >
                <Card className="border-none bg-muted/30 h-full">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-background rounded-2xl shadow-sm flex items-center justify-center mx-auto">
                      {step.icon}
                    </div>
                    <h4 className="font-bold text-lg">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-muted/20 rounded-3xl border border-border/50 space-y-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Your Referrals</h3>
          </div>
          <div className="text-center py-10 space-y-2">
            <p className="text-muted-foreground">You haven't referred any hosts yet.</p>
            <p className="text-sm text-muted-foreground/60">Your referral history will appear here once you start sharing!</p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Terms and conditions apply. Referral credits are valid for 12 months.
        </p>
      </div>
    </div>
  );
}
