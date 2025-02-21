import { useQuery } from "@tanstack/react-query";
import BusinessCard from "@/components/business-card";
import { User } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MsmeDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<User | null>(null);

  const { data: businesses, isLoading } = useQuery<User[]>({
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

      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by business name or type..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses?.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onContact={(business) => setSelectedBusiness(business)}
          />
        ))}
      </div>

      <Dialog open={!!selectedBusiness} onOpenChange={() => setSelectedBusiness(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedBusiness?.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>Type:</strong> {selectedBusiness?.type}</p>
            <p><strong>Email:</strong> {selectedBusiness?.contactInfo.email}</p>
            {selectedBusiness?.contactInfo.phone && (
              <p><strong>Phone:</strong> {selectedBusiness.contactInfo.phone}</p>
            )}
            {selectedBusiness?.contactInfo.address && (
              <p><strong>Address:</strong> {selectedBusiness.contactInfo.address}</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
