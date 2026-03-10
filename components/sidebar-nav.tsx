"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Heart,
  Settings,
  Users,
  Package,
  BarChart3,
  CreditCard,
  Link as LinkIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  // Customer
  {
    label: "My Orders",
    href: "/orders",
    icon: <ShoppingCart className="w-4 h-4" />,
    roles: ["USER"],
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: <Heart className="w-4 h-4" />,
    roles: ["USER"],
  },
  {
    label: "My Profile",
    href: "/profile",
    icon: <Settings className="w-4 h-4" />,
    roles: ["USER"],
  },
  // Affiliate
  {
    label: "Performance",
    href: "/performance",
    icon: <BarChart3 className="w-4 h-4" />,
    roles: ["AFFILIATE"],
  },
  {
    label: "My Links",
    href: "/my-links",
    icon: <LinkIcon className="w-4 h-4" />,
    roles: ["AFFILIATE"],
  },
  {
    label: "Earnings",
    href: "/earnings",
    icon: <CreditCard className="w-4 h-4" />,
    roles: ["AFFILIATE"],
  },
  // Admin
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "Products",
    href: "/products-admin",
    icon: <Package className="w-4 h-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "Affiliates",
    href: "/affiliates",
    icon: <Users className="w-4 h-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "Settings",
    href: "settings",
    icon: <Settings className="w-4 h-4" />,
    roles: ["ADMIN"],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "USER";

  const filteredItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <nav className="flex flex-col gap-2">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
