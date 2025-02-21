import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
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
import { useForm } from "react-hook-form";
import { Logistics } from "@shared/schema";
import { Truck, Package, MapPin } from "lucide-react";

export default function LogisticsPage() {
  const { user } = useAuth();

  const { data: shipments } = useQuery<Logistics[]>({
    queryKey: ["/api/logistics", user?.id],
  });

  const form = useForm({
    defaultValues: {
      orderId: "",
      courierService: "",
      origin: {
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
      destination: {
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
  });

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Logistics & Delivery Support</h1>
          <p className="text-muted-foreground">
            Manage your shipments and track deliveries in real-time
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Create Shipment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Book a new shipment with our courier partners
              </p>
              <Button className="w-full">Book Now</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Track Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time tracking of your shipments
              </p>
              <Button className="w-full">Track Shipment</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Service Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Check delivery availability in your area
              </p>
              <Button className="w-full">Check Coverage</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Shipment</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courierService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Courier Service</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Pickup Address</h3>
                    <FormField
                      control={form.control}
                      name="origin.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="origin.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="origin.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Address</h3>
                    <FormField
                      control={form.control}
                      name="destination.address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="destination.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="destination.pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pincode</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">Create Shipment</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {shipments && shipments.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {shipments.map((shipment) => (
                  <div key={shipment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Order #{shipment.orderId}</h3>
                      <p className="text-sm text-muted-foreground">
                        {shipment.courierService} - {shipment.trackingNumber}
                      </p>
                    </div>
                    <div className="text-sm text-right">
                      <p>Status</p>
                      <p className="font-medium capitalize">{shipment.status}</p>
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
