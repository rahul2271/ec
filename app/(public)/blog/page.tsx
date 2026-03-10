"use client";

// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  slug: string;
}

export default function BlogPage() {
  const posts: BlogPost[] = [
    {
      id: "1",
      title: "10 Tips for Successful E-commerce in 2024",
      excerpt:
        "Learn the essential strategies that successful online stores are using to drive sales and build customer loyalty.",
      date: "March 1, 2024",
      author: "Sarah Johnson",
      category: "Business",
      slug: "tips-ecommerce-2024",
    },
    {
      id: "2",
      title: "Growing Your Affiliate Income: A Beginner's Guide",
      excerpt:
        "Discover how to get started with affiliate marketing and build a sustainable income stream with our platform.",
      date: "February 28, 2024",
      author: "Michael Chen",
      category: "Affiliates",
      slug: "affiliate-beginners-guide",
    },
    {
      id: "3",
      title: "Understanding Payment Processing and Payouts",
      excerpt:
        "A complete guide to how our payment system works, how you get paid, and how to optimize your earnings.",
      date: "February 25, 2024",
      author: "David Park",
      category: "Payments",
      slug: "payment-processing-guide",
    },
    {
      id: "4",
      title: "Platform Updates: New Features Released This Month",
      excerpt:
        "Check out the latest improvements we've made to help you sell more, earn more, and provide better service.",
      date: "February 20, 2024",
      author: "Emily Rodriguez",
      category: "Updates",
      slug: "platform-updates-feb",
    },
    {
      id: "5",
      title: "Case Study: How One Affiliate Earned $50,000",
      excerpt:
        "Real results from a community member who turned our platform into a significant income source. Learn their strategies.",
      date: "February 15, 2024",
      author: "Sarah Johnson",
      category: "Success Stories",
      slug: "affiliate-case-study",
    },
    {
      id: "6",
      title: "Maximizing Customer Lifetime Value",
      excerpt:
        "Strategies for merchants to build long-term customer relationships and increase repeat purchases.",
      date: "February 10, 2024",
      author: "Michael Chen",
      category: "Merchants",
      slug: "customer-lifetime-value",
    },
  ];

  const categories = ["All", "Business", "Affiliates", "Payments", "Updates", "Success Stories", "Merchants"];

  return (
    <>
       
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-secondary border-b border-border py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Tips, guides, and insights to help you succeed on our platform
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={cat === "All" ? "default" : "outline"}
                className="rounded-full"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="bg-secondary h-48 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                  <span className="text-muted-foreground text-sm font-medium">
                    Featured Image
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">By {post.author}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="default">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>

        {/* Newsletter Section */}
        <section className="bg-secondary border-t border-border mt-16 py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
              Stay Updated
            </h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest tips, updates, and success stories.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
