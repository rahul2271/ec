"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, X } from "lucide-react";

interface Affiliate {
  id: string;
  user: {
    name: string;
    email: string;
  };
  affiliateCode: string;
  commissionRate: number;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE";
  totalEarnings: number;
  totalCommissions: number;
  totalPaid: number;
  createdAt: string;
}

export default function AdminAffiliatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [action, setAction] = useState<"approve" | "suspend" | "remove" | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const response = await fetch("/api/admin/affiliates");
      if (response.ok) {
        setAffiliates(await response.json());
      } else {
        setMessage({ type: "error", text: "Failed to fetch affiliates" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to fetch affiliates" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedAffiliate || !action) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/affiliates/${selectedAffiliate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          status:
            action === "approve"
              ? "ACTIVE"
              : action === "suspend"
              ? "SUSPENDED"
              : "INACTIVE",
          notes,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: `Affiliate ${action} successful!` });
        fetchAffiliates();
        setShowActionModal(false);
        setSelectedAffiliate(null);
        setNotes("");
      } else {
        setMessage({ type: "error", text: "Action failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Action failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAffiliates = affiliates.filter((aff) => {
    const matchesSearch =
      aff.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aff.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || aff.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <>
        {/*   */}
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center">
            <p className="text-muted-foreground">Loading affiliates...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
       
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Affiliate Management</h1>
            <p className="text-muted-foreground">Manage and monitor all affiliates</p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg border flex gap-3 ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 flex-col md:flex-row">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Affiliates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Affiliates ({filteredAffiliates.length})</CardTitle>
              <CardDescription>Total: {affiliates.length}</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAffiliates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No affiliates found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Commission
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Earnings
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Paid
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAffiliates.map((affiliate) => (
                        <tr
                          key={affiliate.id}
                          className="border-b border-border hover:bg-secondary/30 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-foreground">
                            {affiliate.user.name}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {affiliate.user.email}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(affiliate.status)}>
                              {affiliate.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {(affiliate.commissionRate * 100).toFixed(0)}%
                          </td>
                          <td className="py-3 px-4 font-medium">
                            ${affiliate.totalEarnings.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            ${affiliate.totalPaid.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {affiliate.status === "PENDING" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedAffiliate(affiliate);
                                  setAction("approve");
                                  setShowActionModal(true);
                                }}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                            )}
                            {affiliate.status === "ACTIVE" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAffiliate(affiliate);
                                  setAction("suspend");
                                  setShowActionModal(true);
                                }}
                              >
                                Suspend
                              </Button>
                            )}
                            {affiliate.status === "SUSPENDED" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAffiliate(affiliate);
                                  setAction("approve");
                                  setShowActionModal(true);
                                }}
                              >
                                Reactivate
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Modal */}
        {showActionModal && selectedAffiliate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {action === "approve" && (
                    <>
                      <Check className="w-5 h-5 text-green-600" /> Approve Affiliate
                    </>
                  )}
                  {action === "suspend" && (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" /> Suspend Affiliate
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedAffiliate.user.name} ({selectedAffiliate.user.email})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes
                  </label>
                  <textarea
                    placeholder="Add notes for this action..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                    rows={3}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAction}
                    disabled={isSubmitting}
                    className={
                      action === "approve"
                        ? "bg-green-600 hover:bg-green-700 flex-1"
                        : "bg-red-600 hover:bg-red-700 flex-1"
                    }
                  >
                    {isSubmitting ? "Processing..." : "Confirm"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowActionModal(false);
                      setSelectedAffiliate(null);
                      setNotes("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
