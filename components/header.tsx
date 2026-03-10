"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">EC</span>
          </div>
          <span className="font-semibold text-lg">EcommercePro</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/shop"
            className="text-foreground hover:text-primary transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/affiliate-program"
            className="text-foreground hover:text-primary transition-colors"
          >
            Become Affiliate
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Right side - Cart and Auth */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {session ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {session.user?.email}
              </span>
              {(session.user as any)?.role === "AFFILIATE" && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                >
                  <Link href="/affiliate">Dashboard</Link>
                </Button>
              )}
              {(session.user as any)?.role === "ADMIN" && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:flex"
                >
                  <Link href="/dashboard">Admin</Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:flex"
              >
                <Link href="/account">Account</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ redirectTo: "/" })}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-secondary py-4 px-4 flex flex-col gap-4">
          <Link
            href="/shop"
            className="text-foreground hover:text-primary transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/affiliate-program"
            className="text-foreground hover:text-primary transition-colors"
          >
            Become Affiliate
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </Link>
          {!session && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button asChild className="w-full justify-start">
                <Link href="/auth/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
