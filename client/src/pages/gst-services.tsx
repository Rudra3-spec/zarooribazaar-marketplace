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
import { Building2, FileText, CheckCircle, HelpCircle } from "lucide-react";

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
            Register for GST and manage your compliance
          </p>
        </div>

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
              <CardTitle>Registration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Legal compliance with tax regulations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Input tax credit benefits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Easier business expansion opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Enhanced credibility in the market</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

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

                  <div className="space-y-4">
                    <h3 className="font-medium">Required Documents</h3>
                    <div className="grid gap-4">
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload PAN Card
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Address Proof
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        Upload Business Registration
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">Submit Application</Button>
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
      </div>
    </div>
  );
}
