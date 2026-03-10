"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Settings {
  storeName: string;
  storeEmail: string;
  affiliateCommissionDefault: number;
  minPayoutAmount: number;
  storeDescription: string;
  supportEmail: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: "My Store",
    storeEmail: "support@mystore.com",
    affiliateCommissionDefault: 10,
    minPayoutAmount: 50,
    storeDescription: "",
    supportEmail: "support@mystore.com",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: name.includes("Commission") || name.includes("Payout") ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage store configuration and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Store Name
                </label>
                <Input
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  placeholder="Your store name"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Store Description
                </label>
                <Textarea
                  name="storeDescription"
                  value={settings.storeDescription}
                  onChange={handleChange}
                  placeholder="Brief description of your store"
                  className="mt-2"
                  rows={4}
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="affiliate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Default Commission Rate (%)
                </label>
                <Input
                  name="affiliateCommissionDefault"
                  type="number"
                  step="0.1"
                  value={settings.affiliateCommissionDefault}
                  onChange={handleChange}
                  placeholder="10"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Default commission percentage for new affiliates
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Minimum Payout Amount ($)
                </label>
                <Input
                  name="minPayoutAmount"
                  type="number"
                  value={settings.minPayoutAmount}
                  onChange={handleChange}
                  placeholder="50"
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum amount required to request a payout
                </p>
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Store Email
                </label>
                <Input
                  name="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={handleChange}
                  placeholder="support@mystore.com"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Support Email
                </label>
                <Input
                  name="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  placeholder="support@mystore.com"
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
