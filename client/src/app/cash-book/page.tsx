"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import CashBook from "@/pages/CashBook";

export default function Page() {
  return (
    <ProtectedRoute>
      <CashBook />
    </ProtectedRoute>
  );
}
