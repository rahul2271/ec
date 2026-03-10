import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
// import { Header } from "@/components/header";

export default function Home() {
  return (
    <>
       
      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 text-balance">
            Premium products meet exceptional value
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Discover our curated collection of high-quality products designed
            to elevate your lifestyle. Shop with confidence and join thousands
            of satisfied customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/affiliate-program">Become an Affiliate</Link>
            </Button>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-border">
          <h2 className="text-3xl font-serif font-bold mb-12 text-foreground">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground">Product {i}</div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">Premium Item {i}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    High-quality product designed for lasting satisfaction
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-foreground">
                      ${99.99 + i * 10}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/product/${i}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 py-16 bg-secondary rounded-lg text-center">
          <h2 className="text-3xl font-serif font-bold mb-4 text-foreground">
            Earn with Our Affiliate Program
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join our partner network and earn competitive commissions on every
            sale. It is free to join and easy to get started.
          </p>
          <Button asChild>
            <Link href="/auth/signup?type=affiliate">
              Start Earning Today
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Shop</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/shop" className="hover:text-foreground">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?category=new" className="hover:text-foreground">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link href="/shop?sort=price" className="hover:text-foreground">
                      Best Sellers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/about" className="hover:text-foreground">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/affiliate-program" className="hover:text-foreground">
                      Affiliate Program
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/privacy" className="hover:text-foreground">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-foreground">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-foreground">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-foreground">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <a href="mailto:support@example.com" className="hover:text-foreground">
                      Email Support
                    </a>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-foreground">
                      Contact Form
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 EcommercePro. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
