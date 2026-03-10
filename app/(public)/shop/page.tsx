"use client";

import { useState, useEffect } from "react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string[];
  category: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // 1. Moved this inside the component!
  const [isDesktop, setIsDesktop] = useState(true);

  // 2. Moved this inside the component!
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    handleResize(); // Check on initial load
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        params.append("take", "20");

        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [search, category]);

  const categories = ["Electronics", "Fashion", "Home", "Sports"];

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 py-12 border-b border-border">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Shop Our Collection
          </h1>
          <p className="text-muted-foreground">
            Browse our carefully curated selection of premium products
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <button
                className="lg:hidden flex items-center gap-2 mb-4 text-foreground font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </button>

              {/* 3. Using the state variable here! */}
              {(showFilters || isDesktop) && (
                <div className="space-y-6 bg-secondary p-6 rounded-lg hidden lg:block">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Category
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={category === ""}
                          onChange={(e) => setCategory(e.target.value)}
                          className="rounded"
                        />
                        <span className="text-sm">All Categories</span>
                      </label>
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={category === cat}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded"
                          />
                          <span className="text-sm">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Search */}
              <div className="lg:hidden mb-6 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline" onClick={() => { setSearch(""); setCategory(""); }}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group"
                    >
                      <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden group-hover:bg-secondary transition-colors">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-muted-foreground">No image</div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {product.category}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                            <span className="text-lg font-bold text-foreground">
                              ${product.price.toFixed(2)}
                            </span>
                            <Button variant="outline" size="sm" asChild>
                              <span>View</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}