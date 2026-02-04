import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, RotateCcw, Printer, Settings2, Eye, Edit, Trash2, Plus } from "lucide-react";

const salesData = [
  {
    id: 1,
    invoiceNo: "7",
    customer: "Walk-in Customer",
    items: ["Mobile Phone Code: 000001 *1 pc"],
    date: "24 Jan, 2026",
    discount: "",
    receivable: 4500,
    paid: 4500,
    returned: 0,
    due: 0,
    purchaseCost: 4150,
    profit: 350,
    status: "PAID",
  },
  {
    id: 2,
    invoiceNo: "6",
    customer: "Walk-in Customer",
    items: ["Mobile Phone Code: 000001 *1 pc"],
    date: "23 Jan, 2026",
    discount: "",
    receivable: 4500,
    paid: 4500,
    returned: 0,
    due: 0,
    purchaseCost: 4150,
    profit: 350,
    status: "PAID",
  },
  {
    id: 3,
    invoiceNo: "5",
    customer: "dsd",
    items: [
      "Desktop Computer Code: 000003 *1 pc",
      "Broiler Pre-Starter Crumble Code: 00000012 *1 Kg",
      "T Shirt Code: 00004 *1 pc",
      "laptop Computer Code: 000002 *1 pc",
    ],
    date: "15 Jan, 2026",
    discount: "",
    receivable: 83358,
    paid: 83358,
    returned: 0,
    due: 0,
    purchaseCost: 76765,
    profit: 6593,
    status: "PAID",
  },
  {
    id: 4,
    invoiceNo: "4",
    customer: "Md Sumon",
    items: ["Desktop Computer Code: 000003 *1 pc"],
    date: "15 Jan, 2026",
    discount: "6%",
    receivable: 431,
    paid: 431,
    returned: 0,
    due: 0,
    purchaseCost: 375,
    profit: 56,
    status: "PAID",
  },
  {
    id: 5,
    invoiceNo: "3",
    customer: "Mahmudul Hasan",
    items: ["laptop Computer Code: 000002 *1 pc", "Gaming Laptop Code: 000011 *1 pc"],
    date: "22 Dec, 2025",
    discount: "10%",
    receivable: 205200,
    paid: 0,
    returned: 0,
    due: 205200,
    purchaseCost: 217200,
    profit: -12000,
    status: "UNPAID",
  },
  {
    id: 6,
    invoiceNo: "2",
    customer: "Walk-in Customer",
    items: ["Air Condition Code: 000007 *1 pc"],
    date: "19 Dec, 2025",
    discount: "",
    receivable: 96000,
    paid: 96000,
    returned: 0,
    due: 0,
    purchaseCost: 91350,
    profit: 4650,
    status: "PAID",
  },
  {
    id: 7,
    invoiceNo: "1",
    customer: "Walk-in Customer",
    items: ["Air Condition Code: 000007 *1 pc"],
    date: "07 Dec, 2025",
    discount: "",
    receivable: 96000,
    paid: 96000,
    returned: 0,
    due: 0,
    purchaseCost: 91350,
    profit: 4650,
    status: "PAID",
  },
];

const Sales = () => {
  const [billNumber, setBillNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customer, setCustomer] = useState("all");
  const [product, setProduct] = useState("all");

  const handleReset = () => {
    setBillNumber("");
    setStartDate("");
    setEndDate("");
    setCustomer("all");
    setProduct("all");
  };

  const summaryStats = [
    { label: "Sold Today:", value: "0 Tk", bg: "bg-[hsl(172,66%,45%)]" },
    { label: "Today Received:", value: "0 Tk", bg: "bg-[hsl(172,66%,50%)]" },
    { label: "Today Profit:", value: "0 Tk", bg: "bg-[hsl(172,66%,45%)]" },
    { label: "Total Sold:", value: "489989.00 Tk", bg: "bg-[hsl(172,66%,50%)]" },
  ];

  return (
    <DashboardLayout title="Sale">
      {/* Summary Stats */}
      <div className="flex flex-wrap justify-center gap-0 mb-6">
        {summaryStats.map((stat, index) => (
          <div key={index} className="flex">
            <div className={`${stat.bg} text-white px-6 py-2 font-medium ${index === 0 ? 'rounded-l-md' : ''}`}>
              {stat.label}
            </div>
            <div className="bg-primary text-white px-6 py-2 font-bold">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
          <TabsTrigger
            value="sales"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            SALES
          </TabsTrigger>
          <TabsTrigger
            value="new-sale"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            asChild
          >
            <a href="/pos">+ NEW SALE</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-0">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Bill Number"
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select Customer</SelectItem>
                    <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                    <SelectItem value="md-sumon">Md Sumon</SelectItem>
                    <SelectItem value="mahmudul">Mahmudul Hasan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select Product</SelectItem>
                    <SelectItem value="mobile">Mobile Phone</SelectItem>
                    <SelectItem value="laptop">Laptop Computer</SelectItem>
                    <SelectItem value="desktop">Desktop Computer</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-primary hover:bg-primary/90">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <div className="flex-1" />
                <Button className="bg-primary hover:bg-primary/90">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sales Table */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Sale</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[hsl(172,66%,40%)] hover:bg-[hsl(172,66%,40%)]">
                      <TableHead className="text-white font-semibold">#</TableHead>
                      <TableHead className="text-white font-semibold">Invoice No.</TableHead>
                      <TableHead className="text-white font-semibold">Customer</TableHead>
                      <TableHead className="text-white font-semibold">Items</TableHead>
                      <TableHead className="text-white font-semibold">Date</TableHead>
                      <TableHead className="text-white font-semibold">Discount</TableHead>
                      <TableHead className="text-white font-semibold">Receivable</TableHead>
                      <TableHead className="text-white font-semibold">Paid</TableHead>
                      <TableHead className="text-white font-semibold">Product Returned</TableHead>
                      <TableHead className="text-white font-semibold">Due</TableHead>
                      <TableHead className="text-white font-semibold text-primary-foreground">Purchase Cost</TableHead>
                      <TableHead className="text-white font-semibold">Profit</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((sale, index) => (
                      <TableRow key={sale.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-primary font-medium">{sale.invoiceNo}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside text-sm">
                            {sale.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.discount}</TableCell>
                        <TableCell>{sale.receivable.toLocaleString()} Tk</TableCell>
                        <TableCell>{sale.paid.toLocaleString()} Tk</TableCell>
                        <TableCell>{sale.returned.toFixed(2)} Tk</TableCell>
                        <TableCell>{sale.due.toLocaleString()} Tk</TableCell>
                        <TableCell className="text-primary">{sale.purchaseCost.toLocaleString()} Tk</TableCell>
                        <TableCell>{sale.profit.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              sale.status === "PAID"
                                ? "bg-primary/10 text-primary hover:bg-primary/20"
                                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            }
                          >
                            {sale.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" className="bg-primary hover:bg-primary/90">
                                <Settings2 className="w-4 h-4 mr-1" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">SOFTGHOR</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default Sales;
