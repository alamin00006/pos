import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Image as ImageIcon, Plus } from "lucide-react";

const categories = [
  { id: "document", name: "Document", color: "bg-primary" },
  { id: "electronics", name: "Electronics", color: "bg-primary" },
  { id: "fashion", name: "Fashion", color: "bg-primary" },
  { id: "hardware", name: "Hardware", color: "bg-primary" },
  { id: "house", name: "House", color: "bg-primary" },
  { id: "poultry", name: "Poultry Feed", color: "bg-primary" },
  { id: "soap", name: "Soap", color: "bg-primary" },
];

const products = [
  { id: 1, name: "Air Condition", code: "000007", price: 96000, stock: 98, unit: "pc" },
  { id: 2, name: "Blazer For Men", code: "000009", price: 3000, stock: 100, unit: "pc" },
  { id: 3, name: "Broiler Pre-Starter Crumble", code: "00000012", price: 3400, stock: 999, unit: "Kg" },
  { id: 4, name: "Desktop Computer", code: "000003", price: 458, stock: 98, unit: "pc" },
  { id: 5, name: "Door Export", code: "000008", price: 15000, stock: 100, unit: "pc" },
  { id: 6, name: "Drill Machine", code: "000010", price: 3000, stock: 100, unit: "pc" },
  { id: 7, name: "Freez", code: "000006", price: 4500, stock: 100, unit: "pc" },
  { id: 8, name: "Gaming Laptop", code: "000011", price: 150000, stock: 99, unit: "pc" },
  { id: 9, name: "Ladies Shirt", code: "000005", price: 900, stock: 100, unit: "pc" },
  { id: 10, name: "Laptop Computer", code: "000002", price: 78000, stock: 98, unit: "pc" },
];

interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

const EstimateManage = () => {
  const [barcode, setBarcode] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [customer, setCustomer] = useState("");
  const [note, setNote] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
          subtotal: product.price,
        },
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.includes(searchQuery)
  );

  return (
    <DashboardLayout title="Estimate Manage">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Input
                placeholder="Scan Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="bg-muted/30"
              />
              <Input
                placeholder="Start to write product name..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <div className="flex gap-2">
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="dsd">dsd</SelectItem>
                    <SelectItem value="mahmudul">Mahmudul Hasan - 0198784545</SelectItem>
                    <SelectItem value="md-sumon">Md Sumon</SelectItem>
                    <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Note :</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Cart Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-white font-semibold">Name</TableHead>
                    <TableHead className="text-white font-semibold text-center">Quantity</TableHead>
                    <TableHead className="text-white font-semibold text-center">Price</TableHead>
                    <TableHead className="text-white font-semibold text-center">Sub T</TableHead>
                    <TableHead className="text-white font-semibold text-center w-12">
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No items added
                      </TableCell>
                    </TableRow>
                  ) : (
                    cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-center">{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{item.subtotal.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {/* Total Row */}
              <div className="bg-[hsl(0,70%,65%)] text-white flex">
                <div className="flex-1 py-3 px-4 text-center font-medium">
                  Total Qty: {totalQty}
                </div>
                <div className="flex-1 py-3 px-4 text-center font-medium">
                  Total: {totalAmount.toLocaleString()} Tk
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button className="bg-primary hover:bg-primary/90 px-8">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Right Side - Product Selection */}
        <div className="space-y-4">
          <div className="flex gap-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "default"}
                    className="w-full justify-start bg-primary hover:bg-primary/90"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Product List</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40"
                  />
                  <Button className="bg-primary hover:bg-primary/90">Search</Button>
                  <Button variant="secondary" onClick={() => setSearchQuery("")}>Reset</Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-xs font-medium truncate">
                        {product.name} - {product.code}
                      </p>
                      <p className="text-xs text-primary font-bold">
                        {product.price.toLocaleString()} Tk
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stock} {product.unit}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-1 mt-4">
                <Button variant="outline" size="sm" disabled>‹</Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">›</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">SOFTGHOR</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default EstimateManage;
