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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Wallet } from "lucide-react";
interface PurchaseItem {
  id: number;
  product: string;
  rate: number;
  qty: number;
  subtotal: number;
}

const AddPurchase = () => {
  const [supplier, setSupplier] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [productSearch, setProductSearch] = useState("");
  const [items, setItems] = useState<PurchaseItem[]>([]);

  const grandTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout title="Purchase">
      {/* Tabs */}
      <Tabs defaultValue="add" className="mb-6">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-0">
          <TabsTrigger
            value="list"
            asChild
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <a href="/purchases">PURCHASES</a>
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-primary"
          >
            + ADD PURCHASE
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Form */}
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Create Purchase</h2>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            Add Supplier
          </Button>
        </div>

        {/* Supplier and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Supplier</label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="supplier1">Supplier 1</SelectItem>
                <SelectItem value="supplier2">Supplier 2</SelectItem>
                <SelectItem value="supplier3">Supplier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Purchase Date</label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>
        </div>

        {/* Product Search */}
        <div className="mb-6">
          <label className="text-sm text-muted-foreground mb-1.5 block">Product</label>
          <Input
            placeholder="Write product.."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                <TableHead className="text-white font-semibold w-16">#SL</TableHead>
                <TableHead className="text-white font-semibold">Product</TableHead>
                <TableHead className="text-white font-semibold text-center">Rate</TableHead>
                <TableHead className="text-white font-semibold text-center">Qty</TableHead>
                <TableHead className="text-white font-semibold text-center">Sub Total</TableHead>
                <TableHead className="text-white font-semibold text-center w-12">
                  <Trash2 className="w-4 h-4 mx-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-right py-3 pr-6">
                    <span className="font-medium">Grand Total: 0 Tk</span>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell className="text-center">{item.rate.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-center">{item.subtotal.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6} className="text-right py-3 pr-6">
                      <span className="font-medium">Grand Total: {grandTotal.toLocaleString()} Tk</span>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Payment Button */}
        <Button className="bg-[hsl(0,65%,65%)] hover:bg-[hsl(0,65%,55%)] text-white">
          <Wallet className="w-4 h-4 mr-2" />
          Payment
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">SOFTGHOR</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default AddPurchase;
