"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, DollarSign } from "lucide-react";

interface PayoutRequest {
  amount: number;
  method: string;
  bankName?: string;
  accountNumber?: string;
  notes?: string;
}

export default function RequestPayoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [earnings, setEarnings] = useState(0);
  const [formData, setFormData] = useState<PayoutRequest>({
    amount: 0,
    method: "BANK_TRANSFER",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "AFFILIATE") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await fetch("/api/affiliates/stats");
        if (response.ok) {
          const data = await response.json();
          setEarnings(data.pendingEarnings || 0);
          setFormData((prev) => ({ ...prev, amount: data.pendingEarnings || 0 }));
        }
      } catch (error) {
        console.error("Failed to fetch earnings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchEarnings();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (formData.amount <= 0) {
      setError("Payout amount must be greater than 0");
      setIsSubmitting(false);
      return;
    }

    if (formData.amount > earnings) {
      setError("Payout amount exceeds available earnings");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/affiliates/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to submit payout request");
      }

      setSuccess(true);
      setFormData({
        amount: earnings - formData.amount,
        method: "BANK_TRANSFER",
      });

      setTimeout(() => {
        router.push("/affiliate/dashboard");
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
         
        <main className="min-h-screen bg-background">
          <div className="max-w-2xl mx-auto px-4 py-12 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
       
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Request Payout</h1>
            <p className="text-muted-foreground">Withdraw your affiliate earnings</p>
          </div>

          {success && (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="pt-6 flex gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Payout request submitted!</p>
                  <p className="text-sm text-green-800">
                    Your payout will be processed within 5-7 business days. Redirecting...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${earnings.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Pending payout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Minimum Payout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$50.00</div>
                <p className="text-xs text-muted-foreground">Minimum amount required</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5-7</div>
                <p className="text-xs text-muted-foreground">Business days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payout Details</CardTitle>
              <CardDescription>Fill in your payout information</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3 items-start mb-6">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payout Amount */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payout Amount ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="50"
                    max={earnings}
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: parseFloat(e.target.value) })
                    }
                    className="w-full"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Available: ${earnings.toFixed(2)}
                  </p>
                </div>

                {/* Payout Method */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payout Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) =>
                      setFormData({ ...formData, method: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background"
                    required
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="PAYPAL">PayPal</option>
                    <option value="STRIPE">Stripe</option>
                  </select>
                </div>

                {/* Bank Details - Only show for Bank Transfer */}
                {formData.method === "BANK_TRANSFER" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Bank Name
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., Chase Bank"
                        value={formData.bankName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, bankName: e.target.value })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Account Number
                      </label>
                      <Input
                        type="password"
                        placeholder="Your account number (encrypted)"
                        value={formData.accountNumber || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, accountNumber: e.target.value })
                        }
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Your account details are encrypted for security
                      </p>
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Add any additional notes for your payout request..."
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>

                {/* Terms */}
                <div className="bg-secondary/30 border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    By requesting a payout, you agree to our payout terms and conditions. Payouts are typically processed within 5-7 business days. A processing fee may apply depending on your chosen method.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || earnings < 50}
                    className="flex-1"
                  >
                    {isSubmitting ? "Processing..." : "Request Payout"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/affiliate/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
