import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  TrendingUp,
  Users,
  MessageSquare,
  ShoppingBag,
  FileText,
  BarChart,
  Megaphone,
} from "lucide-react";
import { Product, Promotion } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products/user", user?.id],
    enabled: !!user?.id,
  });

  const { data: promotions } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions", user?.id],
    enabled: !!user?.id,
  });

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
          <Link href="/auth">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user.businessName}</h1>
            <p className="text-muted-foreground">Here's what's happening with your business</p>
          </div>
          <Link href="/profile">
            <Button>View Profile</Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Products</p>
                  <h3 className="text-2xl font-bold">{products?.length || 0}</h3>
                </div>
                <Package className="h-8 w-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Active Promotions</p>
                  <h3 className="text-2xl font-bold">{promotions?.length || 0}</h3>
                </div>
                <Megaphone className="h-8 w-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Profile Views</p>
                  <h3 className="text-2xl font-bold">128</h3>
                </div>
                <Users className="h-8 w-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">New Messages</p>
                  <h3 className="text-2xl font-bold">12</h3>
                </div>
                <MessageSquare className="h-8 w-8 text-primary opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/profile?tab=products">
                  <Button className="w-full" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </Link>
                <Link href="/marketing">
                  <Button className="w-full" variant="outline">
                    <Megaphone className="mr-2 h-4 w-4" />
                    Create Promotion
                  </Button>
                </Link>
                <Link href="/bulk-orders">
                  <Button className="w-full" variant="outline">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Bulk Orders
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button className="w-full" variant="outline">
                    <BarChart className="mr-2 h-4 w-4" />
                    View Insights
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products?.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Added on {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium">₹{product.price}</p>
                  </div>
                ))}
                {(!products || products.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No recent activity to show
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Growth */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Business Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border rounded-lg">
              <p className="text-muted-foreground">Growth chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Performance */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions?.slice(0, 3).map((promotion) => (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{promotion.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Status: {promotion.status}
                      </p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                ))}
                {(!promotions || promotions.length === 0) && (
                  <p className="text-center text-muted-foreground py-4">
                    No active promotions
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Business Registration</p>
                      <p className="text-sm text-muted-foreground">Updated 2 months ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">GST Certificate</p>
                      <p className="text-sm text-muted-foreground">Updated 1 month ago</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
