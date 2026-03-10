"use client";

import { useState, useEffect, use } from "react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Star, AlertCircle, Copy, Check, Share2 } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  price?: number;
  stock: number;
  attributes: Record<string, string>;
  images: string[];
}

interface Specification {
  id: string;
  name: string;
  value: string;
  order: number;
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  longDescription?: string;
  images?: string[];
  category: string;
  brand?: string;
  stock: number;
  slug: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
  variants?: Variant[];
  specifications?: Specification[];
  relatedProducts?: RelatedProduct[];
  reviews?: any[];
}

// 1. Update the signature to expect a Promise
export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 2. Unwrap the params Promise using React.use()
  const { id: productId } = use(params);

  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [affiliateLink, setAffiliateLink] = useState<string | null>(null);
  const [showAffiliateLink, setShowAffiliateLink] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // 3. Use the unwrapped productId here
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          setError("Product not found");
          return;
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.images?.[0] || "");
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // 4. Update the dependency array

  // Generate affiliate link if user is affiliate
  useEffect(() => {
    if (session?.user && (session.user as any).role === "AFFILIATE" && product) {
      const generateLink = async () => {
        try {
          const response = await fetch("/api/affiliates/links", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: product.id,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            setAffiliateLink(data.shareUrl);
          }
        } catch (err) {
          console.error("Failed to generate affiliate link", err);
        }
      };
      generateLink();
    }
  }, [session, product]);

  const handleAddToCart = async () => {
    if (!session) {
      // 5. Use productId here
      router.push(`/auth/signin?callbackUrl=/product/${productId}`);
      return;
    }

    setIsAddingToCart(true);
    setError(null);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId, // 6. Use productId here
          quantity,
          variantId: selectedVariant || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setQuantity(1);
    } catch (err) {
      setError("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCopyLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareLink = async () => {
    if (affiliateLink && navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: `Check out ${product?.name}!`,
          url: affiliateLink,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading product...</p>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Product not found
            </h1>
            <Button asChild>
              <Link href="/shop">Back to shop</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : null;

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">No image available</div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square bg-muted rounded-lg flex items-center justify-center border-2 cursor-pointer transition-colors ${
                        mainImage === img
                          ? "border-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              {selectedVariant && product.variants?.find(v => v.id === selectedVariant)?.images?.length ? (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-foreground mb-2">Variant Images</p>
                  <div className="grid grid-cols-4 gap-4">
                    {product.variants.find(v => v.id === selectedVariant)?.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Variant ${idx + 1}`}
                        className="aspect-square rounded-lg object-cover border border-border cursor-pointer hover:border-primary"
                        onClick={() => setMainImage(img)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                      {product.name}
                    </h1>
                    <p className="text-muted-foreground">{product.category}</p>
                  </div>
                </div>

                {/* Rating */}
                {averageRating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(parseFloat(averageRating))
                              ? "fill-primary text-primary"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {averageRating} ({product.reviews?.length || 0} reviews)
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </div>
                  {product.stock > 0 ? (
                    <p className="text-sm text-green-600 mt-2">In stock</p>
                  ) : (
                    <p className="text-sm text-destructive mt-2">Out of stock</p>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                {/* Long Description */}
                {product.longDescription && (
                  <div className="mb-8 p-4 bg-secondary/30 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.longDescription}
                    </p>
                  </div>
                )}
              </div>

              {/* Variants Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8 border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4">Choose Options</h3>
                  {/* Group variants by attribute type */}
                  {Object.keys(product.variants[0]?.attributes || {}).map((attrName) => (
                    <div key={attrName} className="mb-4">
                      <label className="block text-sm font-medium text-foreground mb-2 capitalize">
                        {attrName}
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {Array.from(
                          new Set(
                            product.variants
                              ?.filter(v => v.attributes[attrName])
                              .map(v => v.attributes[attrName])
                          )
                        ).map((value) => {
                          const variant = product.variants?.find(
                            v => v.attributes[attrName] === value
                          );
                          return (
                            <button
                              key={value}
                              onClick={() => setSelectedVariant(variant?.id || null)}
                              disabled={!variant || variant.stock === 0}
                              className={`p-3 rounded-lg border-2 transition-all font-medium text-sm ${
                                selectedVariant === variant?.id
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : variant?.stock === 0
                                  ? "border-muted text-muted-foreground opacity-50"
                                  : "border-border hover:border-primary text-foreground"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {selectedVariant && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                      {product.variants.find(v => v.id === selectedVariant)?.price && (
                        <p>Price: ${product.variants.find(v => v.id === selectedVariant)?.price?.toFixed(2)}</p>
                      )}
                      <p>Stock: {product.variants.find(v => v.id === selectedVariant)?.stock} available</p>
                    </div>
                  )}
                </div>
              )}

              {/* Specifications Section */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Specifications</h3>
                  <div className="space-y-3">
                    {product.specifications
                      .sort((a, b) => a.order - b.order)
                      .map((spec) => (
                        <div key={spec.id} className="flex justify-between items-start py-2 border-b border-border last:border-0">
                          <span className="text-sm font-medium text-muted-foreground">
                            {spec.name}
                          </span>
                          <span className="text-sm text-foreground font-medium">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Affiliate Link Section */}
              {affiliateLink && (session?.user as any)?.role === "AFFILIATE" && (
                <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Your Affiliate Link
                  </h3>
                  <div className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={affiliateLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded text-sm text-amber-900"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyLink}
                      className="whitespace-nowrap"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-4 h-4 mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                    {navigator.share && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleShareLink}
                        className="whitespace-nowrap"
                      >
                        <Share2 className="w-4 h-4 mr-1" /> Share
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-amber-800">
                    Earn {((product as any)?.affiliate?.commissionRate || 10) * 100}% commission on every sale made through this link!
                  </p>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="border-t border-border pt-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3 items-start mb-4">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 mb-4">
                    Added to cart successfully!
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                      disabled={isAddingToCart}
                    >
                      −
                    </button>
                    <span className="px-4 py-2 border-l border-r border-border">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-3 py-2 text-foreground hover:bg-secondary transition-colors"
                      disabled={isAddingToCart || quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock === 0}
                  size="lg"
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full mt-3"
                  asChild
                >
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-8">
                Customer Reviews
              </h2>
              <div className="space-y-6">
                {product.reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="border border-border rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {review.user.name}
                        </p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold text-foreground mb-2">
                        {review.title}
                      </h4>
                    )}
                    {review.comment && (
                      <p className="text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}