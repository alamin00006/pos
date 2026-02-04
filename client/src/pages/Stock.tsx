import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { SlidersHorizontal, RotateCcw, Printer, Image as ImageIcon } from "lucide-react";

const stockData = [
  { id: 1, product: "Mobile Phone - 000001", category: "House", price: 4500, cost: 4150, purchased: 100, sold: 2, damaged: 0, returned: 0, available: 98, unit: "pc" },
  { id: 2, product: "Laptop Computer - 000002", category: "Hardware", price: 78000, cost: 72000, purchased: 100, sold: 2, damaged: 0, returned: 0, available: 98, unit: "pc" },
  { id: 3, product: "Desktop Computer - 000003", category: "Fashion", price: 458, cost: 375, purchased: 100, sold: 2, damaged: 0, returned: 0, available: 98, unit: "pc" },
  { id: 4, product: "T Shirt - 000004", category: "Electronics", price: 1500, cost: 1200, purchased: 100, sold: 1, damaged: 0, returned: 0, available: 99, unit: "pc" },
  { id: 5, product: "Ladis Shirt - 000005", category: "Electronics", price: 900, cost: 700, purchased: 100, sold: 0, damaged: 0, returned: 0, available: 100, unit: "pc" },
  { id: 6, product: "Freez - 000006", category: "Electronics", price: 4500, cost: 4200, purchased: 100, sold: 0, damaged: 0, returned: 0, available: 100, unit: "pc" },
  { id: 7, product: "Air Condition - 000007", category: "Document", price: 96000, cost: 91350, purchased: 100, sold: 2, damaged: 0, returned: 0, available: 98, unit: "pc" },
  { id: 8, product: "Door Export - 000008", category: "Electronics", price: 15000, cost: 13945, purchased: 100, sold: 0, damaged: 0, returned: 0, available: 100, unit: "pc" },
  { id: 9, product: "Blazer For Men - 000009", category: "Hardware", price: 3000, cost: 2500, purchased: 100, sold: 0, damaged: 0, returned: 0, available: 100, unit: "pc" },
  { id: 10, product: "Drill Machine - 000010", category: "Document", price: 3000, cost: 2750, purchased: 100, sold: 0, damaged: 0, returned: 0, available: 100, unit: "pc" },
  { id: 11, product: "Gaming Laptop - 000011", category: "House", price: 150000, cost: 145200, purchased: 100, sold: 1, damaged: 0, returned: 0, available: 99, unit: "pc" },
  { id: 12, product: "Broiler Pre-Starter Crumble - 00000012", category: "Poultry Feed", price: 3400, cost: 3190, purchased: 1000, sold: 1, damaged: 0, returned: 0, available: 999, unit: "Kg" },
];

const Stock = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleReset = () => {
    setSelectedProduct("");
    setProductCode("");
    setProductName("");
    setSelectedCategory("");
    setSelectedBrand("");
  };

  return (
    <DashboardLayout title="Product Stock">
      {/* Filters */}
      <div className="bg-card rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Product" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="mobile">Mobile Phone</SelectItem>
              <SelectItem value="laptop">Laptop Computer</SelectItem>
              <SelectItem value="desktop">Desktop Computer</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Product Code"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
          />
          <Input
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="house">House</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="brand1">Brand 1</SelectItem>
              <SelectItem value="brand2">Brand 2</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-[hsl(0,65%,65%)] hover:bg-[hsl(0,65%,55%)] text-white" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Product Stock Table Section */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Product Stock</h3>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-white font-semibold w-12">#</TableHead>
                <TableHead className="text-white font-semibold">Image</TableHead>
                <TableHead className="text-white font-semibold">Product</TableHead>
                <TableHead className="text-white font-semibold">Category</TableHead>
                <TableHead className="text-white font-semibold text-center">Price</TableHead>
                <TableHead className="text-white font-semibold text-center">Cost</TableHead>
                <TableHead className="text-white font-semibold text-center">Purchased</TableHead>
                <TableHead className="text-white font-semibold text-center">Sold</TableHead>
                <TableHead className="text-white font-semibold text-center">Damaged</TableHead>
                <TableHead className="text-white font-semibold text-center">Returned</TableHead>
                <TableHead className="text-white font-semibold text-center">Available Stock</TableHead>
                <TableHead className="text-white font-semibold text-center">Sell Value</TableHead>
                <TableHead className="text-white font-semibold text-center">Purchase Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((item, index) => {
                const sellValue = item.price * item.available;
                const purchaseValue = item.cost * item.available;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell className="text-primary font-medium">{item.product}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-center">{item.price.toLocaleString()}.00 Tk</TableCell>
                    <TableCell className="text-center">{item.cost.toLocaleString()}.00 Tk</TableCell>
                    <TableCell className="text-center">{item.purchased} {item.unit}</TableCell>
                    <TableCell className="text-center">{item.sold} {item.unit}</TableCell>
                    <TableCell className="text-center">{item.damaged} {item.unit}</TableCell>
                    <TableCell className="text-center">{item.returned} {item.unit}</TableCell>
                    <TableCell className="text-center">{item.available} {item.unit}</TableCell>
                    <TableCell className="text-center">{sellValue.toLocaleString()} Tk</TableCell>
                    <TableCell className="text-center">{purchaseValue.toLocaleString()} Tk</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">SOFTGHOR</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default Stock;
