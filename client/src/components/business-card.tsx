import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@shared/schema";
import { Mail } from "lucide-react";

type BusinessCardProps = {
  business: User;
  onContact: (business: User) => void;
};

export default function BusinessCard({ business, onContact }: BusinessCardProps) {
  const avatarUrl = `https://images.unsplash.com/photo-1544724107-6d5c4caaff30`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={business.businessName} />
          <AvatarFallback>{business.businessName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{business.businessName}</h3>
          <p className="text-sm text-muted-foreground">{business.type}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{business.description}</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={() => onContact(business)}
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact
        </Button>
      </CardContent>
    </Card>
  );
}
