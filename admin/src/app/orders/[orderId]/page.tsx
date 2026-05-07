"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OrderView from "@/pages/OrderView";

export default function Page() {
  return (
    <ProtectedRoute>
      <OrderView />
    </ProtectedRoute>
  );
}
