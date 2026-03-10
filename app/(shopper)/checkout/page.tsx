"use client";

import { useState, useEffect } from "react";
// import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { AlertCircle, CheckCircle } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVC: string;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      setError("Failed to load cart items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Validate form
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "street",
        "city",
        "state",
        "zip",
        "country",
      ];
      for (const field of requiredFields) {
        if (!formData[field as keyof FormData]) {
          throw new Error("Please fill in all required fields");
        }
      }

      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`,
          billingAddress: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      setSuccess(true);

      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        window.location.href = `/orders/${data.order.id}`;
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process order");
      setIsProcessing(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <>
         
        <main className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading checkout...</p>
        </main>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
         
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-serif font-bold text-foreground mb-4">
              Your cart is empty
            </h1>
            <Button asChild>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </main>
      </>
    );
  }

  if (success) {
    return (
      <>
         
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Order Placed!
            </h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Redirecting to your order...
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
       
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-foreground mb-12">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      required
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        required
                      />
                      <Input
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        required
                      />
                    </div>
                    <Input
                      name="street"
                      placeholder="Street address"
                      value={formData.street}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        required
                      />
                      <Input
                        name="state"
                        placeholder="State/Province"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="zip"
                        placeholder="ZIP/Postal code"
                        value={formData.zip}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        required
                      />
                      <Input
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                    Payment Information
                  </h2>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This is a demo. Use test card: 4242 4242 4242 4242
                    </p>
                    <Input
                      name="cardNumber"
                      placeholder="Card number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                      <Input
                        name="cardCVC"
                        placeholder="CVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-6 bg-secondary sticky top-24">
                <h2 className="text-xl font-serif font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-foreground font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
