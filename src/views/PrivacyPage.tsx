import { motion } from "framer-motion";
import { ArrowLeft, Lock, Eye, Database, Share2, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  const points = [
    {
      title: "Data Collection",
      icon: <Database className="w-6 h-6 text-primary" />,
      content: "We collect information you provide directly to us, such as when you create an account, make a booking, or communicate with hosts. This includes your name, email address, and payment information."
    },
    {
      title: "Data Usage",
      icon: <Eye className="w-6 h-6 text-primary" />,
      content: "We use your data to process bookings, provide customer support, and improve our services. We may also use it to send you personalized recommendations and marketing communications if you opt-in."
    },
    {
      title: "Information Sharing",
      icon: <Share2 className="w-6 h-6 text-primary" />,
      content: "We share your information with hosts to facilitate bookings. We do not sell your personal data to third parties. We may share data with service providers who help us operate our platform."
    },
    {
      title: "Your Rights",
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      content: "You have the right to access, correct, or delete your personal information. You can manage your privacy settings in your account dashboard or contact us for assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-5 flex items-center gap-4 shadow-sm">
        <Link to="/profile" className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold font-display">Privacy</h1>
      </header>

      <div className="page-wrapper py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your privacy is our priority</h2>
              <p className="text-muted-foreground text-sm">
                We are committed to protecting your personal data and being transparent about how we use it.
              </p>
            </div>
          </div>

          <div className="grid gap-6">
            {points.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 bg-muted/30 pb-4">
                    <div className="p-2 bg-background rounded-lg shadow-sm">
                      {point.icon}
                    </div>
                    <CardTitle className="text-lg">{point.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {point.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Cookies Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and serve personalized content. You can manage your cookie preferences through our cookie consent banner or your browser settings.
            </p>
          </div>

          <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              For more details, please read our full <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>. 
              Questions? Reach out to <a href="mailto:privacy@wonderstay.com" className="text-primary hover:underline">privacy@wonderstay.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
