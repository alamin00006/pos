"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function SupplierPaymentsListPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout title="Supplier Payments List">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Payments List</h1>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              Payments list endpoint not connected yet. Add API:
              <br />
              <span className="font-mono">GET /suppliers/:id/payments</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
