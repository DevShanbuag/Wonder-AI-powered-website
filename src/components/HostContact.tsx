import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, Shield, Eye, EyeOff } from "lucide-react";
import { HostContact as HostContactType } from "@/lib/types";

interface HostContactProps {
  hostContact?: HostContactType;
  canViewContact: boolean;
  hostName: string;
}

export default function HostContact({
  hostContact,
  canViewContact,
  hostName,
}: HostContactProps) {
  const handlePhoneCall = () => {
    if (hostContact?.phone) {
      window.open(`tel:${hostContact.phone}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (hostContact?.email) {
      window.open(`mailto:${hostContact.email}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (hostContact?.whatsapp) {
      window.open(`https://wa.me/${hostContact.whatsapp.replace(/[^\d]/g, '')}`, '_blank');
    }
  };

  if (!canViewContact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Host Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 space-y-3">
            <EyeOff className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Contact information is only available after booking confirmation
            </p>
            <p className="text-xs text-muted-foreground">
              Complete your booking to view {hostName}'s contact details
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Host Contact</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center pb-4 border-b">
          <p className="font-medium">{hostName}</p>
          <p className="text-sm text-muted-foreground">Your host</p>
        </div>

        {hostContact?.phone && (
          <Button
            onClick={handlePhoneCall}
            variant="outline"
            className="w-full justify-start"
          >
            <Phone className="h-4 w-4 mr-2" />
            {hostContact.phone}
          </Button>
        )}

        {hostContact?.email && (
          <Button
            onClick={handleEmail}
            variant="outline"
            className="w-full justify-start"
          >
            <Mail className="h-4 w-4 mr-2" />
            {hostContact.email}
          </Button>
        )}

        {hostContact?.whatsapp && (
          <Button
            onClick={handleWhatsApp}
            variant="outline"
            className="w-full justify-start"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        )}

        {!hostContact?.phone && !hostContact?.email && !hostContact?.whatsapp && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              No contact information available
            </p>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Contact information is visible because you have a confirmed booking
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
