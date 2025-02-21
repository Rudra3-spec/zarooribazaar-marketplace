
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Package, Users, Banknote, TrendingUp, Truck, FileText, UserPlus, ShoppingCart, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ChatPage } from "./chat";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, href, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link href={href}>
      <Card className="p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border border-gray-100 cursor-pointer group h-full">
        <div className="mb-6 relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Icon className="h-12 w-12 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">{title}</h2>
        <p className="text-muted-foreground mb-6 line-clamp-3">{description}</p>
        <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
          Explore {title}
        </Button>
      </Card>
    </Link>
  </motion.div>
);

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Welcome to ZarooriBazaar
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your one-stop platform for MSME growth and connections
          </p>
          <div className="flex justify-center gap-4">
            {!user && (
              <Link href="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <UserPlus className="mr-2 h-5 w-5" /> Get Started
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Search className="mr-2 h-5 w-5" /> Explore Services
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Building2}
            title="MSME Directory"
            description="Connect with verified MSMEs across India. Build partnerships and expand your network."
            href="/msme-directory"
            delay={0.1}
          />
          <FeatureCard
            icon={Package}
            title="Product Listings"
            description="Showcase and discover quality products from verified sellers."
            href="/products"
            delay={0.2}
          />
          <FeatureCard
            icon={Banknote}
            title="Financing"
            description="Access business loans and financial services tailored for MSMEs."
            href="/financing"
            delay={0.3}
          />
          <FeatureCard
            icon={TrendingUp}
            title="Market Insights"
            description="Stay updated with market trends and make data-driven decisions."
            href="/insights"
            delay={0.4}
          />
          <FeatureCard
            icon={Truck}
            title="Bulk Orders"
            description="Place and manage bulk orders with wholesale pricing."
            href="/bulk-orders"
            delay={0.5}
          />
          <FeatureCard
            icon={FileText}
            title="Documentation"
            description="Access guides and documentation for all platform features."
            href="/docs"
            delay={0.6}
          />
        </div>
      </div>
      <ChatPage autoOpen={true} welcomeMessage="Hi! How can I assist you with ZarooriBazaar today?" />
    </div>
  );
}
