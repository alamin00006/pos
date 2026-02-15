"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "Rice (50kg)", price: 2500, category: "Grocery", image: "🍚" },
  { id: 2, name: "Sugar (1kg)", price: 100, category: "Grocery", image: "🧂" },
  { id: 3, name: "Oil (5L)", price: 850, category: "Grocery", image: "🫒" },
  { id: 4, name: "Flour (2kg)", price: 120, category: "Grocery", image: "🌾" },
  { id: 5, name: "Salt (1kg)", price: 35, category: "Grocery", image: "🧂" },
  { id: 6, name: "Milk (1L)", price: 85, category: "Dairy", image: "🥛" },
  { id: 7, name: "Butter (200g)", price: 180, category: "Dairy", image: "🧈" },
  { id: 8, name: "Cheese (250g)", price: 320, category: "Dairy", image: "🧀" },
  { id: 9, name: "Eggs (12 pcs)", price: 180, category: "Dairy", image: "🥚" },
  { id: 10, name: "Bread", price: 60, category: "Bakery", image: "🍞" },
  { id: 11, name: "Biscuits", price: 45, category: "Snacks", image: "🍪" },
  { id: 12, name: "Chips", price: 30, category: "Snacks", image: "🥔" },
];

const categories = ["All", "Grocery", "Dairy", "Bakery", "Snacks"];

const POS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleCheckout = (method: string) => {
    toast({
      title: "Order Placed!",
      description: `Payment via ${method}. Total: ৳${total.toFixed(0)}`,
    });
    setCart([]);
  };

  return (
    <DashboardLayout title="Point of Sale">
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        {/* Products Section */}
        <div className="flex-1 flex flex-col">
          {/* Search & Categories */}
          <div className="mb-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{product.image}</div>
                    <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                    <p className="text-primary font-bold">৳{product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Section */}
        <Card className="w-96 flex flex-col">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-lg">Current Order</h3>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Cart is empty</p>
            ) : (
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">৳{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4 border-t border-border space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>৳{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>৳{tax.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">৳{total.toFixed(0)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex-col h-16 gap-1"
                onClick={() => handleCheckout("Cash")}
                disabled={cart.length === 0}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-xs">Cash</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-16 gap-1"
                onClick={() => handleCheckout("Card")}
                disabled={cart.length === 0}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Card</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-16 gap-1"
                onClick={() => handleCheckout("bKash")}
                disabled={cart.length === 0}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs">bKash</span>
              </Button>
            </div>

            <Button
              className="w-full h-12"
              onClick={() => handleCheckout("Cash")}
              disabled={cart.length === 0}
            >
              Complete Order
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default POS;
