"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import OrderView from "@/pages/OrderView";

export default function Page() {
  return (
    <ProtectedRoute>
      <OrderView />
    </ProtectedRoute>
  );
}
