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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search, RotateCcw } from "lucide-react";
import { useState } from "react";

const purchasesData = [
  {
    id: 1,
    invoiceNo: "PUR-001",
    supplier: "Supplier A",
    items: 5,
    date: "2026-01-30",
    total: 15000,
    status: "Paid",
  },
  {
    id: 2,
    invoiceNo: "PUR-002",
    supplier: "Supplier B",
    items: 3,
    date: "2026-01-29",
    total: 8500,
    status: "Pending",
  },
];

const Purchases = () => {
  const [billNo, setBillNo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supplier, setSupplier] = useState("");

  const handleReset = () => {
    setBillNo("");
    setStartDate("");
    setEndDate("");
    setSupplier("");
  };

  return (
    <DashboardLayout title="Purchase">
      {/* Tabs */}
      <Tabs defaultValue="list" className="mb-6">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-0">
          <TabsTrigger
            value="list"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3 text-primary"
          >
            PURCHASES
          </TabsTrigger>
          <TabsTrigger
            value="add"
            asChild
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            <a href="/purchase/add">+ ADD PURCHASE</a>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filters */}
      <div className="bg-card rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Bill Number</label>
            <Input
              placeholder="Bill Number"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Supplier</label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="supplier1">Supplier 1</SelectItem>
                <SelectItem value="supplier2">Supplier 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary hover:bg-primary">
              <TableHead className="text-white font-semibold">Invoice No.</TableHead>
              <TableHead className="text-white font-semibold">Supplier</TableHead>
              <TableHead className="text-white font-semibold text-center">Items</TableHead>
              <TableHead className="text-white font-semibold">Date</TableHead>
              <TableHead className="text-white font-semibold text-center">Total</TableHead>
              <TableHead className="text-white font-semibold text-center">Status</TableHead>
              <TableHead className="text-white font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchasesData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No purchases found
                </TableCell>
              </TableRow>
            ) : (
              purchasesData.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">{purchase.invoiceNo}</TableCell>
                  <TableCell>{purchase.supplier}</TableCell>
                  <TableCell className="text-center">{purchase.items}</TableCell>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell className="text-center">{purchase.total.toLocaleString()} Tk</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        purchase.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {purchase.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-card">
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">POS Software</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default Purchases;
