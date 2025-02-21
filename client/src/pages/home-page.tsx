import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Package, Users, Banknote, TrendingUp, Truck, FileText, UserPlus, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";

// Placeholder Chat component
function Chat() {
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-md rounded-lg p-4">
      <p className="text-gray-700">Need help? I'm here!</p>
    </div>
  );
}


export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Welcome to ZarooriBazaar
          </h1>
          <p className="text-xl text-muted-foreground">
            Your comprehensive B2B marketplace empowering MSMEs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow group">
            <div className="mb-6">
              <Users className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">MSME Directory</h2>
            <p className="text-muted-foreground mb-6">
              Connect with verified businesses and expand your network
            </p>
            <Link href="/directory">
              <Button className="w-full">Browse Directory</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow group">
            <div className="mb-6">
              <Package className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Product Listings</h2>
            <p className="text-muted-foreground mb-6">
              Showcase and discover quality products from verified sellers
            </p>
            <Link href="/products">
              <Button className="w-full">View Products</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow group">
            <div className="mb-6">
              <Banknote className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Financing</h2>
            <p className="text-muted-foreground mb-6">
              Access business loans and financial services
            </p>
            <Link href="/financing">
              <Button className="w-full">Explore Financing</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow group">
            <div className="mb-6">
              <FileText className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">GST Services</h2>
            <p className="text-muted-foreground mb-6">
              Streamline your GST registration and compliance
            </p>
            <Link href="/gst-services">
              <Button className="w-full">GST Services</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow group">
            <div className="mb-6">
              <Truck className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Logistics</h2>
            <p className="text-muted-foreground mb-6">
              Efficient shipping and delivery solutions
            </p>
            <Link href="/logistics">
              <Button className="w-full">Manage Logistics</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow group">
            <div className="mb-6">
              <ShoppingCart className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Bulk Orders</h2>
            <p className="text-muted-foreground mb-6">
              Place and manage wholesale bulk orders
            </p>
            <Link href="/bulk-orders">
              <Button className="w-full">Bulk Orders</Button>
            </Link>
          </Card>
        </div>
      <Chat />
      </div>
    </div>
  );
}