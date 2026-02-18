"use client";

import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useLocation, useNavigate } from "@/lib/router";

import {
  useGetSupplierByIdQuery,
  useGetSupplierLedgerQuery,
} from "@/redux/api/suppliersApi";

const money = (n: number) => `৳ ${Number(n || 0).toLocaleString()}`;

export default function SupplierReportPage({
  params,
}: {
  params: { id: string };
}) {
  const supplierId = params.id;

  const { data: supplierRes, isLoading: supplierLoading } =
    useGetSupplierByIdQuery(supplierId);

  const { data: ledgerRes, isLoading: ledgerLoading } =
    useGetSupplierLedgerQuery({ id: supplierId, page: 1, limit: 200 });

  const supplier = supplierRes?.data;
  const ledger = ledgerRes?.data ?? [];

  const summary = useMemo(() => {
    const paid = ledger
      .filter((l: any) => l.type === "PAYMENT")
      .reduce((s: number, x: any) => s + Number(x.amount || 0), 0);

    const purchaseDue = ledger
      .filter((l: any) => l.type === "PURCHASE_DUE")
      .reduce((s: number, x: any) => s + Number(x.amount || 0), 0);

    const opening = ledger
      .filter((l: any) => l.type === "OPENING_BALANCE")
      .reduce((s: number, x: any) => s + Number(x.amount || 0), 0);

    const payable = opening + purchaseDue;
    const totalDue = Number(supplier?.due || 0);

    return {
      payable,
      paid,
      purchaseDue,
      walletBalance: 0,
      totalDue,
    };
  }, [ledger, supplier?.due]);

  const loading = supplierLoading || ledgerLoading;

  return (
    <DashboardLayout title="Supplier Report">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Supplier Report</h1>
            <p className="text-sm text-muted-foreground">
              {supplier?.name || "—"} ({supplier?.phone || "—"})
            </p>
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4" />
            Print
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="py-10 text-center">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Payable</p>
                  <p className="text-lg font-semibold">
                    {money(summary.payable)}
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Paid</p>
                  <p className="text-lg font-semibold">{money(summary.paid)}</p>
                </div>

                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Purchase Due</p>
                  <p className="text-lg font-semibold">
                    {money(summary.purchaseDue)}
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">
                    Wallet Balance
                  </p>
                  <p className="text-lg font-semibold">
                    {money(summary.walletBalance)}
                  </p>
                </div>

                <div className="rounded-md border p-4">
                  <p className="text-xs text-muted-foreground">Total Due</p>
                  <p
                    className={
                      summary.totalDue > 0
                        ? "text-lg font-semibold text-destructive"
                        : "text-lg font-semibold"
                    }
                  >
                    {money(summary.totalDue)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-3">Supplier Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{supplier?.email || "—"}</p>
              </div>
              <div className="rounded-md border p-4">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{supplier?.address || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
