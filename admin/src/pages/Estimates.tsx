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
import { Filter, RotateCcw, Printer, Settings2, Eye, Edit, Trash2, FileCheck } from "lucide-react";

const estimatesData = [
  {
    id: 1,
    invoiceNo: "1",
    customer: "Sakib Rabby - Address",
    items: [
      "Air Condition Code: 000007 * pc",
      "Blazer For Men Code: 000009 * pc",
      "Door Export Code: 000008 * pc",
      "Drill Machine Code: 000010 * pc",
    ],
    date: "18 Dec, 2025",
    receivable: 117000,
    status: "Not Convert Invoice",
  },
];

const Estimates = () => {
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

  return (
    <DashboardLayout title="Estimate">
      {/* Tabs */}
      <Tabs defaultValue="estimates" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
          <TabsTrigger
            value="estimates"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            ESTIMATES
          </TabsTrigger>
          <TabsTrigger
            value="new-estimate"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            asChild
          >
            <a href="/estimate/add">+ NEW ESTIMATE</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estimates" className="mt-0">
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
                  <SelectContent className="bg-card">
                    <SelectItem value="all">Select Customer</SelectItem>
                    <SelectItem value="sakib">Sakib Rabby</SelectItem>
                    <SelectItem value="mahmudul">Mahmudul Hasan</SelectItem>
                    <SelectItem value="md-sumon">Md Sumon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={product} onValueChange={setProduct}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="all">Select Product</SelectItem>
                    <SelectItem value="ac">Air Condition</SelectItem>
                    <SelectItem value="laptop">Laptop Computer</SelectItem>
                    <SelectItem value="desktop">Desktop Computer</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-primary hover:bg-primary/90">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/80" onClick={handleReset}>
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

          {/* Estimates Table */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">Estimate</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-white font-semibold">#</TableHead>
                      <TableHead className="text-white font-semibold">Invoice No.</TableHead>
                      <TableHead className="text-white font-semibold">Customer</TableHead>
                      <TableHead className="text-white font-semibold">Items</TableHead>
                      <TableHead className="text-white font-semibold">Date</TableHead>
                      <TableHead className="text-white font-semibold">Receivable</TableHead>
                      <TableHead className="text-white font-semibold">Status</TableHead>
                      <TableHead className="text-white font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {estimatesData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="bg-destructive/10 py-4 rounded">
                            <p className="text-muted-foreground">No estimates found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      estimatesData.map((estimate, index) => (
                        <TableRow key={estimate.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="text-primary font-medium">{estimate.invoiceNo}</TableCell>
                          <TableCell>{estimate.customer}</TableCell>
                          <TableCell>
                            <ul className="list-disc list-inside text-sm">
                              {estimate.items.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </TableCell>
                          <TableCell>{estimate.date}</TableCell>
                          <TableCell>{estimate.receivable.toLocaleString()} Tk</TableCell>
                          <TableCell>
                            <Badge className="bg-destructive/80 text-white hover:bg-destructive/90">
                              {estimate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" className="bg-primary hover:bg-primary/90">
                                  <Settings2 className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileCheck className="w-4 h-4 mr-2" />
                                  Convert to Invoice
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">POS Software</span>. All rights reserved.
      </div>
    </DashboardLayout>
  );
};

export default Estimates;
