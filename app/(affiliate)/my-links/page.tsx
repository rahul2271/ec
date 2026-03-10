"use client";

import { useState, useEffect } from "react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Copy, Trash2, Plus } from "lucide-react";

interface AffiliateLink {
  id: string;
  uniqueCode: string;
  customUrl?: string;
  clickCount: number;
  conversionCount: number;
  commissionEarned: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
  createdAt: string;
}

export default function AffiliateLinksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/affiliate/links");
      return;
    }

    if (status === "authenticated") {
      fetchLinks();
    }
  }, [status, router]);

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/affiliates/links");
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links || []);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("/api/affiliates/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId || null,
          customUrl: customUrl || null,
        }),
      });

      if (response.ok) {
        const newLink = await response.json();
        setLinks([newLink, ...links]);
        setSelectedProductId("");
        setCustomUrl("");
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error("Failed to create link:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getTrackingUrl = (code: string) => {
    return `${window.location.origin}/product?ref=${code}`;
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
                Affiliate Links
              </h1>
              <p className="text-muted-foreground">
                Create and manage your tracking links
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Link
            </Button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="border border-border rounded-lg p-6 bg-secondary mb-8">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                Create New Affiliate Link
              </h2>
              <form onSubmit={handleCreateLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Product (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Product ID or leave blank for general link"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom URL (Optional)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/custom-path"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Links Table */}
          {links.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No affiliate links yet</p>
              <Button onClick={() => setShowCreateForm(true)}>
                Create Your First Link
              </Button>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Link Code
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Clicks
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Conversions
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Earnings
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((link) => (
                      <tr
                        key={link.id}
                        className="border-b border-border hover:bg-secondary transition-colors"
                      >
                        <td className="px-6 py-4">
                          <code className="text-sm font-mono text-foreground">
                            {link.uniqueCode}
                          </code>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {link.product?.name || "General Link"}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {link.clickCount}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {link.conversionCount}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">
                          ${link.commissionEarned.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                getTrackingUrl(link.uniqueCode)
                              );
                            }}
                            className="text-primary hover:text-primary/80 transition-colors mr-4"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
