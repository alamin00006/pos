"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddPurchase from "@/pages/AddPurchase";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddPurchase />
    </ProtectedRoute>
  );
}
