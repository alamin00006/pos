"use client";

import { use, useMemo, useState } from "react";
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

const money = (n: number) => `Tk ${Number(n || 0).toLocaleString()}`;

export default function SupplierPaymentsListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: supplierId } = use(params);
  const [page, setPage] = useState(1);
  const limit = 50;

  const { data: supplierRes } = useGetSupplierByIdQuery(supplierId);
  const { data, isLoading, isFetching } = useGetSupplierLedgerQuery({
    id: supplierId,
    page,
    limit,
  });

  const supplier = supplierRes?.data;
  const payments = useMemo(
    () => (data?.data ?? []).filter((row: any) => row.type === "PAYMENT"),
    [data?.data]
  );
  const meta = data?.meta;

  return (
    <DashboardLayout title="Supplier Payments List">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Payments List</h1>
          <p className="text-sm text-muted-foreground">
            {supplier?.name || "Supplier"} payment history
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        No supplier payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {payment.createdAt
                            ? new Date(payment.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>{money(Number(payment.amount || 0))}</TableCell>
                        <TableCell>{money(Number(payment.balance || 0))}</TableCell>
                        <TableCell>{payment.note || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Page {meta?.page ?? page} of {meta?.totalPages ?? 1}
                {isFetching ? " - Updating..." : ""}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta ? page >= meta.totalPages : true}
                  onClick={() => setPage((value) => value + 1)}
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
