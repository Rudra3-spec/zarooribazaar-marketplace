import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Building2, Package, Users, Banknote, TrendingUp, Truck, FileText, UserPlus, ShoppingCart, Search, ArrowRight, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import ChatPage from "./chat";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, href, delay = 0 }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <Link href={href}>
      <Card className="p-6 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 cursor-pointer group h-full backdrop-blur-sm">
        <div className="mb-6 relative">
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/30 to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Icon className="h-12 w-12 text-primary relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-100 group-hover:text-primary transition-colors">{title}</h2>
        <p className="text-gray-400 mb-6 line-clamp-3">{description}</p>
        <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-primary group">
          Explore {title}
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </Card>
    </Link>
  </motion.div>
);

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHptMC0xMmg0djRoLTR6bTAtMTJoNHY0aC00em0xMiAxMmg0djRoLTR6bTAtMTJoNHY0aC00em0tMjQgMjRoNHY0aC00em0wLTEyaDR2NGgtNHptMC0xMmg0djRoLTR6bTEyIDBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />

      <div className="container py-12 relative">
        <div className="flex justify-between items-center mb-8">
          <Link href="/profile">
            <Button variant="ghost" className="flex items-center gap-2 text-gray-200 hover:text-primary">
              <UserCircle className="h-5 w-5" />
              {user?.businessName || 'My Profile'}
            </Button>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/60">
            Welcome to MSME Portal
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            Your comprehensive platform for MSME growth, connections, and success in the digital age
          </p>
          <div className="flex justify-center gap-4">
            {!user && (
              <Link href="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  <UserPlus className="mr-2 h-5 w-5" /> Get Started
                </Button>
              </Link>
            )}
            <Button size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8">
              <Search className="mr-2 h-5 w-5" /> Explore Services
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Building2}
            title="MSME Directory"
            description="Connect with verified MSMEs across India. Build partnerships and expand your network with trusted businesses."
            href="/directory"
            delay={0.1}
          />
          <FeatureCard
            icon={Package}
            title="Product Listings"
            description="Showcase your products and discover quality offerings from verified sellers. Enhanced visibility for your business."
            href="/products"
            delay={0.2}
          />
          <FeatureCard
            icon={Banknote}
            title="Financing"
            description="Access tailored business loans and financial services designed specifically for MSMEs' growth needs."
            href="/financing"
            delay={0.3}
          />
          <FeatureCard
            icon={TrendingUp}
            title="Market Insights"
            description="Make data-driven decisions with real-time market trends, analytics, and industry reports."
            href="/insights"
            delay={0.4}
          />
          <FeatureCard
            icon={Truck}
            title="Bulk Orders"
            description="Streamline your wholesale business with our bulk ordering system. Get competitive pricing and efficient delivery."
            href="/bulk-orders"
            delay={0.5}
          />
          <FeatureCard
            icon={FileText}
            title="Community & Resources"
            description="Join our thriving business community. Access guides, webinars, and expert knowledge to grow your business."
            href="/community"
            delay={0.6}
          />
        </div>
      </div>
      {user && (
        <ChatPage 
          autoOpen={false} 
          welcomeMessage="👋 Need help exploring our platform? I'm here to assist you! Ask me anything about our services." 
        />
      )}
    </div>
  );
}