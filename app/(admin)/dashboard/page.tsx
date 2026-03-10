"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  DollarSign,
} from "lucide-react";

interface Analytics {
  totalRevenue: string;
  totalOrders: number;
  totalUsers: number;
  totalAffiliates: number;
  ordersByStatus: Record<string, number>;
  topProducts: any[];
  averageOrderValue: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/dashboard");
      return;
    }

    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/");
      return;
    }

    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status, router, session]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <>
         
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      {/*   */}
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your e-commerce platform and affiliates
            </p>
          </div>

          {/* Key Metrics */}
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="border border-border rounded-lg p-6 bg-secondary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      ${analytics.totalRevenue}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Average: ${analytics.averageOrderValue} per order
                </p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-secondary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Orders
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {analytics.totalOrders}
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">All time</p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-secondary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {analytics.totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">Registered</p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-secondary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Active Affiliates
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {analytics.totalAffiliates}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
                <p className="text-xs text-muted-foreground">Partners</p>
              </div>
            </div>
          )}

          {/* Order Status Breakdown */}
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Orders by Status */}
              <div className="border border-border rounded-lg p-6 bg-secondary">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">
                  Orders by Status
                </h2>
                <div className="space-y-4">
                  {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-foreground font-medium">{status}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-border rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                (count / analytics.totalOrders) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-muted-foreground text-sm w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="border border-border rounded-lg p-6 bg-secondary">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">
                  Top Selling Products
                </h2>
                {analytics.topProducts.length === 0 ? (
                  <p className="text-muted-foreground">No product data yet</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topProducts.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {idx + 1}
                            </span>
                          </div>
                          <div>
                            <p className="text-foreground font-medium">
                              Product {idx + 1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {product.count} sold
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-foreground">
                          ${parseFloat(product.revenue).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Management Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Products",
                description: "Add, edit, and manage product inventory",
                icon: Package,
                href: "/products",
              },
              {
                title: "Orders",
                description: "View and manage customer orders",
                icon: ShoppingCart,
                href: "/orders",
              },
              {
                title: "Users",
                description: "Manage customer accounts and roles",
                icon: Users,
                href: "/users",
              },
              {
                title: "Affiliates",
                description: "Manage affiliate accounts and approvals",
                icon: TrendingUp,
                href: "/affiliates",
              },
              {
                title: "Payouts",
                description: "Process and approve affiliate payouts",
                icon: DollarSign,
                href: "/payouts",
              },
              {
                title: "Analytics",
                description: "View detailed platform analytics",
                icon: TrendingUp,
                href: "/analytics",
              },
            ].map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="border border-border rounded-lg p-6 bg-secondary hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
