import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { Filter, RotateCcw } from "lucide-react";
import { useGetCustomersQuery } from "@/redux/api/customerApi";
import { useGetReturnsQuery } from "@/redux/api/returnsApi";

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString()}`;

const Returns = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [posId, setPosId] = useState("");
  const [customer, setCustomer] = useState("all");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<any>({ page: 1, limit: 25 });

  const { data: customersRes } = useGetCustomersQuery({ page: 1, limit: 100 });
  const { data, isLoading, isFetching } = useGetReturnsQuery(query);

  const customers = customersRes?.data ?? [];
  const returnsList = data?.data ?? [];
  const meta = data?.meta;

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPosId("");
    setCustomer("all");
    setPage(1);
    setQuery({ page: 1, limit: 25 });
  };

  const handleFilter = () => {
    setPage(1);
    setQuery({
      page: 1,
      limit: 25,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      saleId: posId || undefined,
      customerId: customer !== "all" ? customer : undefined,
    });
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    setQuery((prev: any) => ({ ...prev, page: nextPage }));
  };

  return (
    <DashboardLayout title="Return List">
      <div className="space-y-6">
      <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Sales returns
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-gray-950">
            Return List
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track returned invoices, products, customers, reasons, and totals.
          </p>
        </div>
      </section>

      {/* Filters */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <Input
              placeholder="Pos Id"
              value={posId}
              onChange={(e) => setPosId(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((item: any) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} {item.phone ? `- ${item.phone}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="bg-primary hover:bg-primary/90" onClick={handleFilter}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="secondary" className="bg-secondary hover:bg-secondary/80" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Return List */}
      <Card className="border-primary/10 shadow-sm">
        <CardContent className="p-0">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-semibold text-gray-950">Return List</h3>
            <p className="text-sm text-gray-500">
              {isFetching ? "Updating..." : `${meta?.total ?? returnsList.length} return records`}
            </p>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10 m-4 rounded">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : returnsList.length === 0 ? (
            <div className="bg-destructive/10 text-center py-4 m-4 rounded">
              <p className="text-muted-foreground">You have no Returned List</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SL</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Sale</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returnsList.map((item: any, index: number) => {
                    const returnItems = item.items || item.returnItems || [];
                    const total = returnItems.reduce(
                      (sum: number, row: any) =>
                        sum + Number(row.quantity || 0) * Number(row.unitPrice || 0),
                      0
                    );

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{(page - 1) * 25 + index + 1}</TableCell>
                        <TableCell>
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                        </TableCell>
                        <TableCell>
                          {item.customer?.name ||
                            item.sale?.customer?.name ||
                            "Walk-in Customer"}
                        </TableCell>
                        <TableCell>{item.sale?.invoiceNo || item.saleId || "-"}</TableCell>
                        <TableCell>{item.returnType || "-"}</TableCell>
                        <TableCell>{returnItems.length}</TableCell>
                        <TableCell>{money(total)}</TableCell>
                        <TableCell>{item.reason || item.notes || item.note || "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
          {isFetching ? " - Updating..." : ""}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => changePage(page - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta ? page >= meta.totalPages : true}
            onClick={() => changePage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026 <span className="text-primary font-medium">POS Software</span>. All rights reserved.
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Returns;
