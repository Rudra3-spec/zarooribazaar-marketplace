import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Package, Activity, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is a demonstration view with placeholder data. In the production version, this will be connected to real-time market analytics.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Active MSMEs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-sm text-muted-foreground">Demo data</p>
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
              <p className="text-sm text-muted-foreground">Demo data</p>
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
              <p className="text-sm text-muted-foreground">Demo data</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Business Growth Trends (Demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={[
                  { month: "Jan", businesses: 400 },
                  { month: "Feb", businesses: 300 },
                  { month: "Mar", businesses: 200 },
                  { month: "Apr", businesses: 278 },
                  { month: "May", businesses: 189 },
                  { month: "Jun", businesses: 239 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="businesses" stroke="#2563eb" name="Registered Businesses" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Business Categories (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Manufacturing</span>
                  <span className="text-primary font-medium">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Services</span>
                  <span className="text-primary font-medium">28%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Retail</span>
                  <span className="text-primary font-medium">24%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Technology</span>
                  <span className="text-primary font-medium">16%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution (Demo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>North Region</span>
                  <span className="text-primary font-medium">35%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>South Region</span>
                  <span className="text-primary font-medium">30%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>West Region</span>
                  <span className="text-primary font-medium">20%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>East Region</span>
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