import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Building2, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function MsmeDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<User | null>(null);
  const { user } = useAuth();

  const { data: businesses } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const filteredBusinesses = businesses?.filter(business => 
    business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">MSME Directory</h1>
        <p className="text-muted-foreground">
          Connect with other businesses and explore partnership opportunities
        </p>
      </div>

      <Tabs defaultValue="all" className="max-w-6xl mx-auto">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All MSMEs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended Partners</TabsTrigger>
          <TabsTrigger value="matching">Similar Businesses</TabsTrigger>
        </TabsList>

        <div className="max-w-md mx-auto mb-8 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by business name or type..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses?.map((business) => (
              <Card 
                key={business.id} 
                className="hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => setSelectedBusiness(business)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={business.avatarUrl} alt={business.businessName} />
                      <AvatarFallback>{business.businessName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium leading-none mb-2">{business.businessName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{business.type}</p>
                      <div className="space-y-2">
                        {business.description && (
                          <p className="text-sm line-clamp-2">{business.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses?.map((business) => (
              <Card 
                key={business.id} 
                className="hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => setSelectedBusiness(business)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={business.avatarUrl} alt={business.businessName} />
                      <AvatarFallback>{business.businessName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium leading-none mb-2">{business.businessName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{business.type}</p>
                      <div className="space-y-2">
                        {business.description && (
                          <p className="text-sm line-clamp-2">{business.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matching">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses?.map((business) => (
              <Card 
                key={business.id} 
                className="hover:bg-accent/5 transition-colors cursor-pointer"
                onClick={() => setSelectedBusiness(business)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={business.avatarUrl} alt={business.businessName} />
                      <AvatarFallback>{business.businessName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium leading-none mb-2">{business.businessName}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{business.type}</p>
                      <div className="space-y-2">
                        {business.description && (
                          <p className="text-sm line-clamp-2">{business.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Business Profile</DialogTitle>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedBusiness.avatarUrl} alt={selectedBusiness.businessName} />
                  <AvatarFallback>{selectedBusiness.businessName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{selectedBusiness.businessName}</h2>
                  <Badge variant="secondary" className="mt-1">{selectedBusiness.type}</Badge>
                </div>
              </div>

              {selectedBusiness.description && (
                <div>
                  <h3 className="font-medium mb-2">About</h3>
                  <p className="text-muted-foreground">{selectedBusiness.description}</p>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-medium mb-2">Contact Information</h3>
                {selectedBusiness.contactInfo?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBusiness.contactInfo.email}</span>
                  </div>
                )}
                {selectedBusiness.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBusiness.contactInfo.phone}</span>
                  </div>
                )}
                {selectedBusiness.contactInfo?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBusiness.contactInfo.address}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" asChild>
                  <Link href={`/chat?partner=${selectedBusiness.id}`}>
                    Start Chat
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/business/${selectedBusiness.id}`}>
                    View Full Profile
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}