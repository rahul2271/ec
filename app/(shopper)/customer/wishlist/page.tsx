"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  image: string;
  slug: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems(items.filter((item) => item.id !== id));
        toast.success("Removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (response.ok) {
        toast.success("Added to cart");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">
          Save your favorite products for later
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading wishlist...
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              Your wishlist is empty
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-2">
                    {item.productName}
                  </h3>
                  <p className="text-lg font-bold text-primary mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/product/${item.slug}`}>View</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addToCart(item.productId)}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Heart className="w-4 h-4 fill-current text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
