"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function SupplierPurchaseListPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <DashboardLayout title="Supplier Purchase List">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Purchase List</h1>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">
              Purchase list endpoint not connected yet. Add API:
              <br />
              <span className="font-mono">GET /suppliers/:id/purchases</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
