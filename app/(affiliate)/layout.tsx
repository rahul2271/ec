"use client";

import { Header } from "@/components/header";
import { Breadcrumb } from "@/components/breadcrumb";
import { SidebarNav } from "@/components/sidebar-nav";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/affiliate/performance");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "AFFILIATE"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if ((session?.user as any)?.role !== "AFFILIATE") {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <Breadcrumb />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
              <div className="sticky top-24">
                <SidebarNav />
              </div>
            </aside>
            <div className="md:col-span-3">{children}</div>
          </div>
        </div>
      </main>
      <Toaster />
    </>
  );
}
