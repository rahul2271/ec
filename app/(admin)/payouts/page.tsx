"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "date-fns";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

interface Payout {
  id: string;
  affiliateId: string;
  affiliateName: string;
  affiliateEmail: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "PAID" | "REJECTED";
  method: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("PENDING");
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, []);

  useEffect(() => {
    let filtered = payouts;
    if (filterStatus !== "ALL") {
      filtered = payouts.filter((p) => p.status === filterStatus);
    }
    setFilteredPayouts(filtered);
  }, [filterStatus, payouts]);

  const fetchPayouts = async () => {
    try {
      const response = await fetch("/api/admin/payouts");
      if (response.ok) {
        const data = await response.json();
        setPayouts(data);
      }
    } catch (error) {
      toast.error("Failed to fetch payouts");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPayout) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/payouts/${selectedPayout.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "APPROVED",
          notes: approvalNotes,
        }),
      });

      if (response.ok) {
        toast.success("Payout approved");
        fetchPayouts();
        setSelectedPayout(null);
        setApprovalNotes("");
      } else {
        toast.error("Failed to approve payout");
      }
    } catch (error) {
      toast.error("Error processing payout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPayout) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/admin/payouts/${selectedPayout.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "REJECTED",
          notes: approvalNotes,
        }),
      });

      if (response.ok) {
        toast.success("Payout rejected");
        fetchPayouts();
        setSelectedPayout(null);
        setApprovalNotes("");
      } else {
        toast.error("Failed to reject payout");
      }
    } catch (error) {
      toast.error("Error rejecting payout");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "APPROVED":
        return "outline";
      case "PAID":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "default";
    }
  };

  const stats = {
    total: payouts.length,
    pending: payouts.filter((p) => p.status === "PENDING").length,
    paid: payouts
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payout Management</h1>
        <p className="text-muted-foreground mt-2">
          Review and process affiliate payouts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${stats.paid.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus} className="space-y-4">
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved</TabsTrigger>
          <TabsTrigger value="PAID">Paid</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus}>
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading payouts...
              </CardContent>
            </Card>
          ) : filteredPayouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No payouts found
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">
                        {payout.affiliateName}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {payout.affiliateEmail}
                      </TableCell>
                      <TableCell className="font-semibold">
                        ${payout.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {payout.method}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payout.status) as any}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(new Date(payout.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        {payout.status === "PENDING" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPayout(payout)}
                              >
                                Review
                              </Button>
                            </DialogTrigger>
                            {selectedPayout?.id === payout.id && (
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Review Payout Request
                                  </DialogTitle>
                                  <DialogDescription>
                                    Approve or reject the payout request from{" "}
                                    {selectedPayout.affiliateName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Amount
                                    </p>
                                    <p className="text-2xl font-bold text-foreground">
                                      ${selectedPayout.amount.toFixed(2)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-foreground">
                                      Notes
                                    </label>
                                    <Textarea
                                      value={approvalNotes}
                                      onChange={(e) =>
                                        setApprovalNotes(e.target.value)
                                      }
                                      placeholder="Add approval/rejection notes"
                                      className="mt-2"
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      variant="destructive"
                                      onClick={handleReject}
                                      disabled={isProcessing}
                                    >
                                      <X className="w-4 h-4 mr-2" /> Reject
                                    </Button>
                                    <Button
                                      onClick={handleApprove}
                                      disabled={isProcessing}
                                    >
                                      <Check className="w-4 h-4 mr-2" /> Approve
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
