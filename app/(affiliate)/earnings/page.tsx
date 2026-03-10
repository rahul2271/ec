"use client";

import { useState, useEffect } from "react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DollarSign } from "lucide-react";

interface Payout {
  id: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
  completedAt?: string;
}

interface AffiliateStats {
  totalEarnings: string;
  totalPaid: string;
  pendingEarnings: string;
}

export default function AffiliatePayoutsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/affiliate/payouts");
      return;
    }

    if (status === "authenticated") {
      fetchPayoutData();
    }
  }, [status, router]);

  const fetchPayoutData = async () => {
    try {
      const [payoutsRes, affiliateRes] = await Promise.all([
        fetch("/api/affiliates/payouts"),
        fetch("/api/affiliates"),
      ]);

      if (payoutsRes.ok) {
        const data = await payoutsRes.json();
        setPayouts(data.payouts || []);
      }

      if (affiliateRes.ok) {
        const data = await affiliateRes.json();
        setStats({
          totalEarnings: data.stats.totalEarnings,
          totalPaid: data.stats.totalPaid,
          pendingEarnings: data.stats.pendingEarnings,
        });
      }
    } catch (error) {
      console.error("Failed to fetch payout data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      alert("Please enter a valid payout amount");
      return;
    }

    setIsRequesting(true);

    try {
      const response = await fetch("/api/affiliates/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(payoutAmount),
          paymentMethod,
        }),
      });

      if (response.ok) {
        const newPayout = await response.json();
        setPayouts([newPayout, ...payouts]);
        setPayoutAmount("");
        setShowRequestForm(false);
        alert("Payout request submitted successfully!");
        fetchPayoutData();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to request payout");
      }
    } catch (error) {
      console.error("Failed to request payout:", error);
      alert("Failed to request payout");
    } finally {
      setIsRequesting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50";
      case "PROCESSING":
        return "text-blue-600 bg-blue-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "FAILED":
        return "text-destructive bg-destructive/10";
      default:
        return "text-muted-foreground bg-muted";
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
       
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
                Payout Management
              </h1>
              <p className="text-muted-foreground">
                Track and request your affiliate earnings
              </p>
            </div>
            <Button
              onClick={() => setShowRequestForm(!showRequestForm)}
              disabled={!stats || parseFloat(stats.pendingEarnings) === 0}
            >
              Request Payout
            </Button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="border border-border rounded-lg p-6 bg-secondary">
                <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                <p className="text-3xl font-bold text-foreground">
                  ${stats.totalEarnings}
                </p>
              </div>
              <div className="border border-border rounded-lg p-6 bg-secondary">
                <p className="text-sm text-muted-foreground mb-2">Total Paid</p>
                <p className="text-3xl font-bold text-foreground">
                  ${stats.totalPaid}
                </p>
              </div>
              <div className="border border-border rounded-lg p-6 bg-secondary">
                <p className="text-sm text-muted-foreground mb-2">
                  Pending Earnings
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ${stats.pendingEarnings}
                </p>
              </div>
            </div>
          )}

          {/* Payout Request Form */}
          {showRequestForm && (
            <div className="border border-border rounded-lg p-6 bg-secondary mb-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                Request Payout
              </h2>
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payout Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="pl-8"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  {stats && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Available: ${stats.pendingEarnings}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="STRIPE">Stripe Connect</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isRequesting}>
                    {isRequesting ? "Submitting..." : "Submit Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Payouts List */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center">
                        <p className="text-muted-foreground">No payouts yet</p>
                      </td>
                    </tr>
                  ) : (
                    payouts.map((payout) => (
                      <tr
                        key={payout.id}
                        className="border-b border-border hover:bg-secondary transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-foreground">
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                          ${payout.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {payout.paymentMethod || "Not specified"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(
                              payout.status
                            )}`}
                          >
                            {payout.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Button variant="outline" asChild>
              <Link href="/affiliate/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
