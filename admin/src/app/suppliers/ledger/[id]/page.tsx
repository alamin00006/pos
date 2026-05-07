"use client";

import { use, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  useGetSupplierByIdQuery,
  useGetSupplierLedgerQuery,
} from "@/redux/api/suppliersApi";

const money = (n: number) => `৳ ${Number(n || 0).toLocaleString()}`;

export default function SupplierLedgerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: supplierId } = use(params);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  const { data: supplierRes } = useGetSupplierByIdQuery(supplierId);
  const supplier = supplierRes?.data;

  const { data, isLoading, isFetching } = useGetSupplierLedgerQuery({
    id: supplierId,
    page,
    limit,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <DashboardLayout title="Supplier Ledger">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Ledger</h1>
          <p className="text-sm text-muted-foreground">
            {supplier?.name || "—"} • Current Due:{" "}
            {money(Number(supplier?.due || 0))}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <select
                  className="border border-border rounded px-2 py-1 text-sm bg-background"
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>

              <Button variant="outline" onClick={() => window.print()}>
                Print
              </Button>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      Type
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      Amount
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      Balance
                    </TableHead>
                    <TableHead className="text-primary-foreground font-semibold">
                      Note
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        No ledger found
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r: any) => (
                      <TableRow key={r.id} className="hover:bg-muted/50">
                        <TableCell>
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell className="font-medium">{r.type}</TableCell>
                        <TableCell>{money(Number(r.amount || 0))}</TableCell>
                        <TableCell>{money(Number(r.balance || 0))}</TableCell>
                        <TableCell>{r.note || "—"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {meta?.page ?? page} of {meta?.totalPages ?? 1}{" "}
                {isFetching ? "• Updating..." : ""}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button variant="default" size="sm" className="bg-primary">
                  {page}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta ? page >= meta.totalPages : true}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
