import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Package, Activity } from "lucide-react";

// Sample data - In a real app, this would come from your API
const marketTrends = [
  { month: "Jan", users: 400, products: 240, engagement: 140 },
  { month: "Feb", users: 300, products: 139, engagement: 221 },
  { month: "Mar", users: 200, products: 980, engagement: 229 },
  { month: "Apr", users: 278, products: 390, engagement: 200 },
  { month: "May", users: 189, products: 480, engagement: 218 },
  { month: "Jun", users: 239, products: 380, engagement: 250 },
];

export default function InsightsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
          <p className="text-muted-foreground">
            Analyze market trends and make data-driven decisions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-sm text-muted-foreground">↑ 12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Listed Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-sm text-muted-foreground">↑ 8% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Platform Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-sm text-muted-foreground">↑ 3% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Growth Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#2563eb" 
                    name="Users"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="products" 
                    stroke="#16a34a" 
                    name="Products"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#9333ea" 
                    name="Engagement"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Electronics</span>
                  <span className="text-primary font-medium">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Textiles</span>
                  <span className="text-primary font-medium">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Food & Beverages</span>
                  <span className="text-primary font-medium">24%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Handicrafts</span>
                  <span className="text-primary font-medium">16%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>North India</span>
                  <span className="text-primary font-medium">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>South India</span>
                  <span className="text-primary font-medium">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>West India</span>
                  <span className="text-primary font-medium">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>East India</span>
                  <span className="text-primary font-medium">15%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
