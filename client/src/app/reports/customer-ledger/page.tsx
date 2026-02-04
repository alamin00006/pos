"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import CustomerLedger from "@/pages/CustomerLedger";

export default function Page() {
  return (
    <ProtectedRoute>
      <CustomerLedger />
    </ProtectedRoute>
  );
}
