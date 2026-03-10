"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
  "/admin/products": [
    { label: "Admin", href: "/admin" },
    { label: "Products", href: "/admin/products" },
  ],
  "/admin/products/new": [
    { label: "Admin", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    { label: "New Product", href: "/admin/products/new" },
  ],
  "/customer/orders": [
    { label: "Account", href: "/customer/profile" },
    { label: "Orders", href: "/customer/orders" },
  ],
  "/customer/wishlist": [
    { label: "Account", href: "/customer/profile" },
    { label: "Wishlist", href: "/customer/wishlist" },
  ],
  "/affiliate/performance": [
    { label: "Affiliate", href: "/affiliate" },
    { label: "Performance", href: "/affiliate/performance" },
  ],
  "/affiliate/my-links": [
    { label: "Affiliate", href: "/affiliate" },
    { label: "My Links", href: "/affiliate/my-links" },
  ],
  "/affiliate/earnings": [
    { label: "Affiliate", href: "/affiliate" },
    { label: "Earnings", href: "/affiliate/earnings" },
  ],
};

export function Breadcrumb() {
  const pathname = usePathname();

  let breadcrumbs = breadcrumbMap[pathname] || [];

  if (breadcrumbs.length === 0 && pathname.includes("/product/")) {
    breadcrumbs = [
      { label: "Shop", href: "/shop" },
      { label: "Product", href: pathname },
    ];
  }

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      <Link href="/" className="text-muted-foreground hover:text-foreground">
        Home
      </Link>
      {breadcrumbs.map((crumb, idx) => (
        <div key={crumb.href} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {idx === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
