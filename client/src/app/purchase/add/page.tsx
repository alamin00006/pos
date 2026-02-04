"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddPurchase from "@/pages/AddPurchase";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddPurchase />
    </ProtectedRoute>
  );
}
