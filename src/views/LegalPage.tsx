import { motion } from "framer-motion";
import { ArrowLeft, FileText, Scale, ShieldAlert, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LegalPage() {
  const sections = [
    {
      title: "Terms of Service",
      icon: <FileText className="w-6 h-6 text-primary" />,
      content: "By using Wonderstay, you agree to comply with and be bound by our terms of service. This includes our policies on bookings, cancellations, and user conduct. We aim to provide a safe and transparent marketplace for both hosts and guests."
    },
    {
      title: "Cancellation Policy",
      icon: <ShieldAlert className="w-6 h-6 text-primary" />,
      content: "Our standard cancellation policy allows for a full refund if cancelled within 48 hours of booking, provided the check-in date is at least 14 days away. Specific listings may have stricter policies as set by the host."
    },
    {
      title: "Host Obligations",
      icon: <Scale className="w-6 h-6 text-primary" />,
      content: "Hosts are responsible for providing accurate descriptions, maintaining high standards of cleanliness, and complying with local laws and regulations regarding short-term rentals."
    },
    {
      title: "Guest Conduct",
      icon: <ScrollText className="w-6 h-6 text-primary" />,
      content: "Guests are expected to respect the host's property and neighborhood. Excessive noise, illegal activities, and unauthorized additional guests are strictly prohibited and may result in immediate eviction without refund."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center gap-4 shadow-sm">
        <Link to="/profile" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display">Legal</h1>
      </header>

      <div className="page-wrapper py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg">
              Important information about our rules, your rights, and how we operate.
            </p>
          </div>

          <div className="grid gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {section.icon}
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-muted/30 rounded-2xl border border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Last updated: March 31, 2026. For specific legal inquiries, please contact us at <a href="mailto:legal@wonderstay.com" className="text-primary hover:underline">legal@wonderstay.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
