"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import CustomerLedger from "@/pages/CustomerLedger";

export default function Page() {
  return (
    <ProtectedRoute>
      <CustomerLedger />
    </ProtectedRoute>
  );
}
