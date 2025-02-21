import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoanApplication, User } from "@shared/schema";
import { Building2, FileText } from "lucide-react";

export default function FinancingPage() {
  const { user } = useAuth();

  const { data: loanApplications } = useQuery<LoanApplication[]>({
    queryKey: ["/api/loan-applications", user?.id],
  });

  const { data: financialInstitutions } = useQuery<User[]>({
    queryKey: ["/api/financial-institutions"],
  });

  const form = useForm({
    defaultValues: {
      amount: "",
      purpose: "",
      documents: {
        businessPlan: "",
        financialStatements: "",
        taxReturns: "",
      },
    },
  });

  return (
    <div className="container py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Financing</h1>
          <p className="text-muted-foreground">
            Apply for loans and connect with financial institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Credit Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Credit Score</h3>
                  <p className="text-2xl font-bold">{user?.creditScore || "Not Available"}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-1">Business Type</h3>
                  <p>{user?.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Financial Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financialInstitutions?.map((institution) => (
                  <div key={institution.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{institution.businessName}</h3>
                      <p className="text-sm text-muted-foreground">{institution.description}</p>
                    </div>
                    <Button variant="outline" size="sm">Contact</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Apply for a Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Purpose</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      Upload Business Plan
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Financial Statements
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Tax Returns
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full">Submit Application</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {loanApplications && loanApplications.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">₹{application.amount}</h3>
                      <p className="text-sm text-muted-foreground">{application.purpose}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-right">
                        <p>Status</p>
                        <p className="font-medium capitalize">{application.status}</p>
                      </div>
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