import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, InsertUser } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Redirect } from "wouter";
import { motion } from "framer-motion";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      businessName: "",
      type: "",
      description: "",
      contactInfo: {
        email: "",
        phone: "",
        address: "",
      },
    },
    shouldUseNativeValidation: true,
  });

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Welcome to ZarooriBazaar
          </h1>
          <p className="text-gray-400 mb-8">
            Your gateway to business growth and networking
          </p>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="w-full mb-6 bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-primary">Login</TabsTrigger>
              <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-primary">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Username *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-800/50 border-gray-700 focus:border-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Password *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field} 
                            className="bg-gray-800/50 border-gray-700 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data as InsertUser))} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Username *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-800/50 border-gray-700 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Password *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            {...field}
                            className="bg-gray-800/50 border-gray-700 focus:border-primary"
                          />
                        </FormControl>
                        <FormDescription>
                          Password must contain at least:
                          • 8 characters
                          • One uppercase letter
                          • One lowercase letter  
                          • One number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Business Name</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            className="bg-gray-800/50 border-gray-700 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Business Type</FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="e.g., Manufacturer, Wholesaler, Retailer"
                            className="bg-gray-800/50 border-gray-700 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="contactInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Email *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            {...field}
                            className="bg-gray-800/50 border-gray-700 focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
        </div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6">
                Connect, Grow, and Succeed with ZarooriBazaar
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                Join thousands of MSMEs in India's fastest-growing B2B marketplace. 
                Access business opportunities, connect with potential partners, and scale your operations.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}