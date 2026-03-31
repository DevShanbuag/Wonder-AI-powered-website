import { motion } from "framer-motion";
import { ArrowLeft, Search, MessageCircle, Phone, LifeBuoy, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I book a stay?",
      answer: "Browse our listings, select your desired dates and number of guests, and click 'Reserve'. You'll be guided through the payment process to confirm your booking."
    },
    {
      question: "What is the host cancellation policy?",
      answer: "Hosts can choose from different cancellation levels (Flexible, Moderate, or Strict). You can see the specific policy for each listing before you book."
    },
    {
      question: "How do I become a host?",
      answer: "Go to your profile and click 'Become a host'. You'll need to provide details about your property, upload photos, and set your pricing and availability."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, all payments are processed through encrypted channels using Razorpay. We never store your full credit card details on our servers."
    }
  ];

  const supportOptions = [
    { title: "Chat with us", icon: <MessageCircle className="w-5 h-5" />, desc: "Available 24/7 for urgent issues" },
    { title: "Call Support", icon: <Phone className="w-5 h-5" />, desc: "Mon-Fri, 9am - 6pm IST" },
    { title: "Help Center", icon: <BookOpen className="w-5 h-5" />, desc: "Detailed guides and tutorials" },
    { title: "Safety Center", icon: <ShieldCheck className="w-5 h-5" />, desc: "Resources for a safe stay" }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center gap-4 shadow-sm">
        <Link to="/profile" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display">Get Help</h1>
      </header>

      <div className="page-wrapper py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">How can we help you today?</h2>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for articles, policies, and more..." 
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supportOptions.map((option) => (
              <Card key={option.title} className="border-none bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer text-center p-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  {option.icon}
                </div>
                <h3 className="font-semibold text-sm">{option.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">{option.desc}</p>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-primary" /> Frequently Asked Questions
            </h3>
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.question} className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center space-y-4">
            <h3 className="text-xl font-bold">Still need help?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Our support team is always here to help you with any questions or concerns you might have.
            </p>
            <button className="btn-primary px-8 py-3 rounded-xl font-semibold">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
