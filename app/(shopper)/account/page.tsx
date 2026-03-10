"use client";

import { useSession, signOut } from "next-auth/react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/account");
    }
  }, [status, router]);

  if (status === "loading") {
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-secondary rounded-lg p-6">
                <div className="mb-6 pb-6 border-b border-border">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-semibold text-foreground break-all">
                    {session?.user?.email}
                  </p>
                </div>

                <nav className="space-y-2">
                  <Link
                    href="/account"
                    className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                  >
                    Account Overview
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block px-4 py-2 rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => signOut({ redirectTo: "/" })}
                    className="w-full text-left px-4 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors font-medium"
                  >
                    Sign out
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="border border-border rounded-lg p-8">
                <h1 className="text-3xl font-serif font-bold text-foreground mb-6">
                  Welcome back, {session?.user?.name || "Customer"}!
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-secondary rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
                    <p className="text-3xl font-bold text-foreground">0</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Total Spent
                    </p>
                    <p className="text-3xl font-bold text-foreground">$0.00</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-6">
                    <p className="text-sm text-muted-foreground mb-2">
                      Wishlist Items
                    </p>
                    <p className="text-3xl font-bold text-foreground">0</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Account Information
                  </h2>
                  <div className="bg-secondary rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-foreground font-medium">
                        {session?.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-foreground font-medium">
                        {session?.user?.name || "Not set"}
                      </p>
                    </div>
                    <Button variant="outline" asChild className="mt-4">
                      <Link href="#edit-profile">Edit Profile</Link>
                    </Button>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                    Quick Links
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/orders">View Orders</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/wishlist">My Wishlist</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/contact">Contact Support</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
