
import { useQuery } from "@tanstack/react-query";
import BusinessCard from "@/components/business-card";
import { User } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MsmeDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<User | null>(null);
  const { user } = useAuth();

  const { data: businesses } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: recommendedPartners } = useQuery<User[]>({
    queryKey: ["/api/businesses/recommended", user?.id],
    enabled: !!user,
  });

  const { data: matchingBusinesses } = useQuery<User[]>({
    queryKey: ["/api/businesses/matching", user?.id],
    enabled: !!user,
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
              <BusinessCard
                key={business.id}
                business={business}
                onSelect={() => setSelectedBusiness(business)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedPartners?.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onSelect={() => setSelectedBusiness(business)}
                badge="Recommended Partner"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="matching">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingBusinesses?.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onSelect={() => setSelectedBusiness(business)}
                badge="Similar Business"
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBusiness?.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>Type:</strong> {selectedBusiness?.type}</p>
            <p><strong>Description:</strong> {selectedBusiness?.description}</p>
            <Button className="w-full" onClick={() => window.location.href = `/chat?partner=${selectedBusiness?.id}`}>
              <UsersIcon className="w-4 h-4 mr-2" />
              Connect & Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
