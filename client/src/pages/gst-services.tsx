
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
import { GstRegistration } from "@shared/schema";
import { Building2, FileText, CheckCircle, HelpCircle, Calendar, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GstServicesPage() {
  const { user } = useAuth();
  
  const { data: gstRegistration } = useQuery<GstRegistration>({
    queryKey: ["/api/gst-registration", user?.id],
  });

  const form = useForm({
    defaultValues: {
      businessType: "",
      annualTurnover: "",
      documents: {
        panCard: "",
        addressProof: "",
        businessRegistration: "",
      },
    },
  });

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">GST Services</h1>
          <p className="text-muted-foreground">
            Complete GST registration and compliance management
          </p>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    GST Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {user?.gstStatus === 'registered' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <HelpCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <div>
                        <h3 className="font-medium">Registration Status</h3>
                        <p className="capitalize">{user?.gstStatus || 'Not Registered'}</p>
                      </div>
                    </div>
                    {user?.gstNumber && (
                      <div>
                        <h3 className="font-medium mb-1">GST Number</h3>
                        <p className="font-mono">{user.gstNumber}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Next Due Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>GSTR-1</span>
                      <span className="font-medium">11th Mar 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>GSTR-3B</span>
                      <span className="font-medium">20th Mar 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="registration">
            {!user?.gstNumber && (
              <Card>
                <CardHeader>
                  <CardTitle>GST Registration Application</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="businessType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Type</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="annualTurnover"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Turnover (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Submit Application
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {gstRegistration && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">GST Registration Application</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(gstRegistration.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <p>Status</p>
                        <p className="font-medium capitalize">{gstRegistration.status}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compliance">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Monthly Returns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">GSTR-1 (February 2024)</h3>
                      <div className="flex items-center gap-2 text-yellow-500">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Due in 5 days</span>
                      </div>
                      <Button className="w-full mt-4">File Return</Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">GSTR-3B (February 2024)</h3>
                      <div className="flex items-center gap-2 text-yellow-500">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Due in 14 days</span>
                      </div>
                      <Button className="w-full mt-4">File Return</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-muted rounded">
                      <Calendar className="h-5 w-5" />
                      <div>
                        <p className="font-medium">March 11, 2024</p>
                        <p className="text-sm text-muted-foreground">GSTR-1 Filing Due</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-muted rounded">
                      <Calendar className="h-5 w-5" />
                      <div>
                        <p className="font-medium">March 20, 2024</p>
                        <p className="text-sm text-muted-foreground">GSTR-3B Filing Due</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
