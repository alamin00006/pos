"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sales from "@/pages/sales/Sales";

export default function Page() {
  return (
    <ProtectedRoute>
      <Sales />
    </ProtectedRoute>
  );
}
