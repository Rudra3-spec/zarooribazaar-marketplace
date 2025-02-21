import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  if (!user || location === "/auth") return null;

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/directory">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  MSME Directory
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/products">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Products
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/financing">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Financing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/gst-services">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  GST Services
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/marketing">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Marketing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/logistics">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Logistics
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/learning">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Learning
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/chat">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Chat
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/profile">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Button 
          variant="ghost" 
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}