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
import { useGetSupplierByIdQuery } from "@/redux/api/suppliersApi";
import { useGetSupplierPurchasesQuery } from "@/redux/api/purchasesApi";

const money = (n: number) => `Tk ${Number(n || 0).toLocaleString()}`;

export default function SupplierPurchaseListPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: supplierId } = use(params);
  const [page, setPage] = useState(1);
  const limit = 25;

  const { data: supplierRes } = useGetSupplierByIdQuery(supplierId);
  const { data, isLoading, isFetching } = useGetSupplierPurchasesQuery({
    supplierId,
    params: { page, limit },
  });

  const supplier = supplierRes?.data;
  const purchases = data?.data ?? [];
  const meta = data?.meta;

  return (
    <DashboardLayout title="Supplier Purchase List">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Purchase List</h1>
          <p className="text-sm text-muted-foreground">
            {supplier?.name || "Supplier"} purchase history
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : purchases.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        No supplier purchases found
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchases.map((purchase: any) => (
                      <TableRow key={purchase.id}>
                        <TableCell>
                          {purchase.purchaseDate
                            ? new Date(purchase.purchaseDate).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>{purchase.invoiceNo || purchase.id}</TableCell>
                        <TableCell>{money(Number(purchase.total || 0))}</TableCell>
                        <TableCell>{money(Number(purchase.paid || 0))}</TableCell>
                        <TableCell>{money(Number(purchase.due || 0))}</TableCell>
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
