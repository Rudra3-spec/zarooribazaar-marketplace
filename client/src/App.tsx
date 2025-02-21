import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import MsmeDirectory from "@/pages/msme-directory";
import ProductListings from "@/pages/product-listings";
import Profile from "@/pages/profile";
import Financing from "@/pages/financing";
import GstServices from "@/pages/gst-services";
import Marketing from "@/pages/marketing";
import Logistics from "@/pages/logistics";
import Learning from "@/pages/learning";
import BulkOrders from "@/pages/bulk-orders";
import Community from "@/pages/community";
import { ProtectedRoute } from "./lib/protected-route";
import Navigation from "./components/ui/navigation";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/directory" component={MsmeDirectory} />
      <ProtectedRoute path="/products" component={ProductListings} />
      <ProtectedRoute path="/financing" component={Financing} />
      <ProtectedRoute path="/gst-services" component={GstServices} />
      <ProtectedRoute path="/marketing" component={Marketing} />
      <ProtectedRoute path="/logistics" component={Logistics} />
      <ProtectedRoute path="/learning" component={Learning} />
      <ProtectedRoute path="/bulk-orders" component={BulkOrders} />
      <ProtectedRoute path="/community" component={Community} />
      <ProtectedRoute path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Navigation />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;