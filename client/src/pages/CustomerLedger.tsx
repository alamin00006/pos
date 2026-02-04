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
import { Filter, RotateCcw, Printer } from "lucide-react";

const customers = [
  { id: "1", name: "Mahmudul Hasan", phone: "0198784545", address: "Address" },
  { id: "2", name: "Ahmed Khan", phone: "0171234567", address: "Dhaka" },
  { id: "3", name: "Fatima Begum", phone: "0181234567", address: "Chittagong" },
];

const ledgerData = [
  {
    date: "2025-12-22",
    particulars: "Sale #3",
    debit: 205200.0,
    credit: null,
    balance: 205200.0,
  },
];

const CustomerLedger = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const customer = customers.find((c) => c.id === selectedCustomer);

  const handleFilter = () => {
    console.log("Filtering...", { selectedCustomer, startDate, endDate });
  };

  const handleReset = () => {
    setSelectedCustomer("1");
    setStartDate("");
    setEndDate("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout title="Customer Ledger">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary">Customer Ledger</h1>

        {/* Filter Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} {c.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Enter Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <Input
              type="date"
              placeholder="Enter End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={handleFilter} className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              <Button onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Ledger Document */}
        <div className="bg-background border border-border rounded-lg p-6 space-y-6">
          {/* Company Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 pb-6 border-b border-border">
            <div className="flex items-center">
              <div className="flex">
                <div className="bg-[hsl(215,28%,17%)] text-white px-4 py-3 font-bold text-2xl">
                  SOFT
                </div>
                <div className="bg-primary text-white px-4 py-3 font-bold text-2xl">
                  GHOR
                </div>
              </div>
              <div className="ml-2">
                <p className="text-[10px] text-muted-foreground tracking-wider">
                  MORE THAN A SOFTWARE COMPANY
                </p>
              </div>
            </div>
            <div className="text-sm text-right">
              <p>
                <span className="text-muted-foreground">Address : </span>
                <span className="font-medium">
                  Holding 53 (1st floor), Road: 04 Block: G,Banasree , Dhaka
                  1219.
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Phone : </span>
                <span className="font-medium">01779724380</span>
              </p>
              <p>
                <span className="text-muted-foreground">Email : </span>
                <span className="font-medium text-primary">
                  info@softghor.com
                </span>
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-2 gap-y-2 max-w-md">
            <p className="text-muted-foreground">Account of:</p>
            <p className="font-medium">{customer?.name}</p>

            <p className="text-muted-foreground">Address:</p>
            <p>{customer?.address}</p>

            <p className="text-muted-foreground">Contact No:</p>
            <p>{customer?.phone}</p>
          </div>

          {/* Ledger Table */}
          <div>
            <h2 className="text-xl font-bold text-center mb-4">
              Customer Ledger
            </h2>
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(172,66%,40%)] hover:bg-[hsl(172,66%,40%)]">
                  <TableHead className="text-white font-semibold">Date</TableHead>
                  <TableHead className="text-white font-semibold">
                    Particulars
                  </TableHead>
                  <TableHead className="text-white font-semibold">Debit</TableHead>
                  <TableHead className="text-white font-semibold">Credit</TableHead>
                  <TableHead className="text-white font-semibold">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  ledgerData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{row.date}</TableCell>
                      <TableCell>{row.particulars}</TableCell>
                      <TableCell>
                        {row.debit ? row.debit.toFixed(2) : ""}
                      </TableCell>
                      <TableCell>
                        {row.credit ? row.credit.toFixed(2) : ""}
                      </TableCell>
                      <TableCell>{row.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">SOFTGHOR</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default CustomerLedger;
