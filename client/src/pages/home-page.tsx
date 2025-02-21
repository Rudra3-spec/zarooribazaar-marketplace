import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Package, Users } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to ZarooriBazaar</h1>
        <p className="text-xl text-muted-foreground">
          Your one-stop B2B marketplace for MSMEs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-6 border rounded-lg">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">MSME Directory</h2>
          <p className="text-muted-foreground mb-4">
            Connect with other businesses and expand your network
          </p>
          <Link href="/directory">
            <Button>Browse Directory</Button>
          </Link>
        </div>

        <div className="text-center p-6 border rounded-lg">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Listings</h2>
          <p className="text-muted-foreground mb-4">
            Discover and list products for your business
          </p>
          <Link href="/products">
            <Button>View Products</Button>
          </Link>
        </div>

        <div className="text-center p-6 border rounded-lg">
          <Building2 className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Business Profile</h2>
          <p className="text-muted-foreground mb-4">
            Manage your business presence and settings
          </p>
          <Link href="/profile">
            <Button>View Profile</Button>
          </Link>
        </div>
      </div>

      <div className="mt-16 p-8 rounded-lg bg-muted">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Welcome, {user?.businessName}!
          </h2>
          <p className="text-muted-foreground">
            Get started by exploring our directory of MSMEs, browsing products,
            or updating your business profile to attract potential partners.
          </p>
        </div>
      </div>
    </div>
  );
}
