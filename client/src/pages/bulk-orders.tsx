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
import { BulkOrder, WholesaleDeal, insertBulkOrderSchema, insertWholesaleDealSchema } from "@shared/schema";
import { Package, ShoppingCart, Truck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function BulkOrdersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<'bulkOrder' | 'wholesaleDeal' | null>(null);

  const { data: bulkOrders } = useQuery<BulkOrder[]>({
    queryKey: ["/api/bulk-orders", user?.id],
  });

  const { data: wholesaleDeals } = useQuery<WholesaleDeal[]>({
    queryKey: ["/api/wholesale-deals"],
  });

  const createBulkOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bulk-orders", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bulk order created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bulk-orders", user?.id] });
      bulkOrderForm.reset();
      setActiveDialog(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createWholesaleDealMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/wholesale-deals", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Wholesale deal created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/wholesale-deals"] });
      wholesaleDealForm.reset();
      setActiveDialog(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const bulkOrderForm = useForm({
    resolver: zodResolver(insertBulkOrderSchema),
    defaultValues: {
      productId: 0,
      quantity: 0,
      requestedPrice: 0,
      notes: "",
    },
  });

  const wholesaleDealForm = useForm({
    resolver: zodResolver(insertWholesaleDealSchema),
    defaultValues: {
      productId: 0,
      minQuantity: 0,
      pricePerUnit: 0,
      description: "",
      terms: "",
    },
  });

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Bulk Orders & Wholesale Deals</h1>
          <p className="text-muted-foreground">
            Connect with suppliers and place bulk orders at wholesale prices
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Place Bulk Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Request bulk quantities at discounted rates
              </p>
              <Dialog open={activeDialog === 'bulkOrder'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('bulkOrder')}>New Bulk Order</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Bulk Order Request</DialogTitle>
                  </DialogHeader>
                  <Form {...bulkOrderForm}>
                    <form onSubmit={bulkOrderForm.handleSubmit((data) => createBulkOrderMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={bulkOrderForm.control}
                        name="productId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product ID</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bulkOrderForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bulkOrderForm.control}
                        name="requestedPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requested Price per Unit (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={bulkOrderForm.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Submit Order</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Create Wholesale Deal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Offer your products at wholesale prices
              </p>
              <Dialog open={activeDialog === 'wholesaleDeal'} onOpenChange={() => setActiveDialog(null)}>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setActiveDialog('wholesaleDeal')}>New Wholesale Deal</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Wholesale Deal</DialogTitle>
                  </DialogHeader>
                  <Form {...wholesaleDealForm}>
                    <form onSubmit={wholesaleDealForm.handleSubmit((data) => createWholesaleDealMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={wholesaleDealForm.control}
                        name="productId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product ID</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={wholesaleDealForm.control}
                        name="minQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={wholesaleDealForm.control}
                        name="pricePerUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price per Unit (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={wholesaleDealForm.control}
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
                      <FormField
                        control={wholesaleDealForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Terms & Conditions</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Create Deal</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Active Bulk Orders */}
        {bulkOrders && bulkOrders.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Your Bulk Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Product ID: {order.productId}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                      <p className="text-sm text-muted-foreground">Price: ₹{order.requestedPrice} per unit</p>
                    </div>
                    <div className="text-sm text-right">
                      <p>Status</p>
                      <p className="font-medium capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Wholesale Deals */}
        {wholesaleDeals && wholesaleDeals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Available Wholesale Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {wholesaleDeals.map((deal) => (
                  <Card key={deal.id}>
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Product ID: {deal.productId}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{deal.description}</p>
                      <div className="space-y-1 mb-4">
                        <p className="text-sm">Minimum Quantity: {deal.minQuantity}</p>
                        <p className="text-sm">Price: ₹{deal.pricePerUnit} per unit</p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => {
                          bulkOrderForm.setValue("productId", deal.productId);
                          bulkOrderForm.setValue("requestedPrice", deal.pricePerUnit);
                          setActiveDialog('bulkOrder');
                        }}
                      >
                        Place Order
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}