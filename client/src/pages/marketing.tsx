import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Promotion, insertPromotionSchema } from "@shared/schema";
import { Megaphone, TrendingUp, BarChart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function MarketingPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<'listing' | 'seo' | 'analytics' | null>(null);

  const { data: promotions } = useQuery<Promotion[]>({
    queryKey: ["/api/promotions", user?.id],
  });

  const createPromotionMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/promotions", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Promotion created successfully",
      });
      queryClient.invalidateQueries(["/api/promotions", user?.id]);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertPromotionSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      budget: 0,
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data: any) => {
    createPromotionMutation.mutate(data);
  };

  const handleListingSelect = (type: 'premium' | 'standard') => {
    createPromotionMutation.mutate({
      title: `${type === 'premium' ? 'Premium' : 'Standard'} Featured Listing`,
      description: `${type === 'premium' ? 'Top' : 'Enhanced'} placement in search results`,
      type: 'listing',
      budget: type === 'premium' ? 999 : 499,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    });
    setActiveDialog(null);
  };

  const handleSEOOptimization = () => {
    toast({
      title: "Starting Optimization",
      description: "Our system is analyzing your profile for optimization opportunities",
    });
    setActiveDialog(null);
  };

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Digital Marketing & Promotion</h1>
          <p className="text-muted-foreground">
            Boost your business visibility and reach more customers
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Featured Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get premium placement in search results and category pages
              </p>
              <Dialog open={activeDialog === 'listing'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('listing')}>Create Listing</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Featured Listing</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <p>Choose your listing package:</p>
                    <div className="grid gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Premium Package</h3>
                          <p className="text-sm text-muted-foreground mb-4">Top placement in search results and category pages</p>
                          <Button 
                            className="w-full" 
                            onClick={() => handleListingSelect('premium')}
                            disabled={createPromotionMutation.isPending}
                          >
                            Select Premium - ₹999/month
                          </Button>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-2">Standard Package</h3>
                          <p className="text-sm text-muted-foreground mb-4">Enhanced visibility in search results</p>
                          <Button 
                            className="w-full"
                            onClick={() => handleListingSelect('standard')}
                            disabled={createPromotionMutation.isPending}
                          >
                            Select Standard - ₹499/month
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                SEO Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Optimize your business profile and products for better visibility
              </p>
              <Dialog open={activeDialog === 'seo'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('seo')}>Optimize Now</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>SEO Optimization Tools</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">Profile Optimization</h3>
                        <p className="text-sm text-muted-foreground mb-4">Current SEO Score: 75/100</p>
                        <div className="space-y-2">
                          <p className="text-sm">Recommendations:</p>
                          <ul className="text-sm text-muted-foreground list-disc pl-4">
                            <li>Add more keywords to your business description</li>
                            <li>Complete your business address information</li>
                            <li>Add more product images and descriptions</li>
                          </ul>
                        </div>
                        <Button 
                          className="w-full mt-4"
                          onClick={handleSEOOptimization}
                        >
                          Start Optimization
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track your promotion performance and ROI
              </p>
              <Dialog open={activeDialog === 'analytics'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('analytics')}>View Analytics</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Marketing Analytics Dashboard</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium mb-1">Profile Views</h3>
                          <p className="text-2xl font-bold">1,234</p>
                          <p className="text-xs text-green-500">↑ 12% this month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium mb-1">Product Clicks</h3>
                          <p className="text-2xl font-bold">456</p>
                          <p className="text-xs text-green-500">↑ 8% this month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-sm font-medium mb-1">Inquiries</h3>
                          <p className="text-2xl font-bold">89</p>
                          <p className="text-xs text-green-500">↑ 15% this month</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-4">Performance Overview</h3>
                        <div className="h-48 flex items-center justify-center border rounded">
                          <p className="text-muted-foreground">Analytics chart will be displayed here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Promotion</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Promotion Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createPromotionMutation.isPending}
                >
                  Create Promotion
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {promotions && promotions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotions.map((promotion) => (
                  <div key={promotion.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{promotion.title}</h3>
                      <p className="text-sm text-muted-foreground">{promotion.description}</p>
                    </div>
                    <div className="text-sm text-right">
                      <p>Status</p>
                      <p className="font-medium capitalize">{promotion.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}