"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, TrendingUp, DollarSign, Link as LinkIcon, Eye } from "lucide-react";

interface AffiliateStats {
  totalEarnings: number;
  totalCommissions: number;
  totalPaid: number;
  pendingEarnings: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  activeLinks: number;
}

interface AffiliateLink {
  id: string;
  trackingCode: string;
  customUrl?: string;
  product?: { name: string; id: string };
  clicks: number;
  conversions: number;
  createdAt: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
  notes?: string;
}

export default function AffiliateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "AFFILIATE") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, linksRes, payoutsRes] = await Promise.all([
          fetch("/api/affiliates/stats"),
          fetch("/api/affiliates/links"),
          fetch("/api/affiliates/payouts"),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        
        // Safely extract links
        if (linksRes.ok) {
          const linksData = await linksRes.json();
          setLinks(Array.isArray(linksData) ? linksData : (linksData.links || []));
        }
        
        // Safely extract payouts to prevent .map() errors
        if (payoutsRes.ok) {
          const payoutsData = await payoutsRes.json();
          setPayouts(Array.isArray(payoutsData) ? payoutsData : (payoutsData.payouts || []));
        }
      } catch (error) {
        console.error("Failed to fetch affiliate data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchData();
    }
  }, [session]);

  const handleCopyLink = (trackingCode: string) => {
    const link = `${window.location.origin}/?ref=${trackingCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(trackingCode);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
            <p className="text-muted-foreground">Loading affiliate dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  // Ensure arrays exist for rendering just in case state gets weird
  const safeLinks = Array.isArray(links) ? links : [];
  const safePayouts = Array.isArray(payouts) ? payouts : [];

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Affiliate Dashboard</h1>
            <p className="text-muted-foreground">Manage your affiliate links and track earnings</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.totalEarnings?.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground">All-time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats?.pendingEarnings?.toFixed(2) || "0.00"}</div>
                <p className="text-xs text-muted-foreground">Awaiting payout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                <Eye className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalConversions || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.conversionRate?.toFixed(2) || "0.00"}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Links</CardTitle>
                <LinkIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeLinks || 0}</div>
                <p className="text-xs text-muted-foreground">Referral links</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="links" className="space-y-4">
            <TabsList>
              <TabsTrigger value="links">Referral Links</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Referral Links Tab */}
            <TabsContent value="links">
              <Card>
                <CardHeader>
                  <CardTitle>Your Referral Links</CardTitle>
                  <CardDescription>
                    Share these links to earn commission on every sale
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {safeLinks.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No referral links yet</p>
                      <Button asChild>
                        <a href="/shop">Browse Products</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {safeLinks.map((link) => (
                        <div
                          key={link.id}
                          className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">
                                {link.product?.name || "General Link"}
                              </h4>
                              <p className="text-sm text-muted-foreground break-all">
                                {link.customUrl || `ref=${link.trackingCode}`}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCopyLink(link.trackingCode)}
                            >
                              {copiedId === link.trackingCode ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-1" /> Copy
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Clicks</p>
                              <p className="text-lg font-semibold text-foreground">
                                {link.clicks}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Conversions</p>
                              <p className="text-lg font-semibold text-foreground">
                                {link.conversions}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground">
                              Created {new Date(link.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payouts Tab */}
            <TabsContent value="payouts">
              <Card>
                <CardHeader>
                  <CardTitle>Payout History</CardTitle>
                  <CardDescription>View your past and pending payouts</CardDescription>
                </CardHeader>
                <CardContent>
                  {safePayouts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No payouts yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Date
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Amount
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Method
                            </th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {safePayouts.map((payout) => (
                            <tr
                              key={payout.id}
                              className="border-b border-border hover:bg-secondary/30 transition-colors"
                            >
                              <td className="py-3 px-4">
                                {new Date(payout.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 font-semibold text-foreground">
                                ${payout.amount.toFixed(2)}
                              </td>
                              <td className="py-3 px-4">{payout.method.replace("_", " ")}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    payout.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : payout.status === "PROCESSING"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {payout.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Affiliate Settings</CardTitle>
                  <CardDescription>Manage your affiliate account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Commission Settings</h3>
                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-2">Default Commission Rate</p>
                      <p className="text-2xl font-bold text-foreground">15%</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        This rate is applied to all sales made through your referral links
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-4">Payout Information</h3>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="/affiliate/payouts">Request Payout</a>
                    </Button>
                  </div>

                  <div className="border-t border-border pt-6">
                    <h3 className="font-semibold text-foreground mb-4">Your Affiliate Code</h3>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={session?.user?.email || ""}
                        readOnly
                        className="flex-1 px-3 py-2 bg-muted border border-border rounded text-sm text-foreground"
                      />
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}