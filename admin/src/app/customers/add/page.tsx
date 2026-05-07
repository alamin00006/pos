"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddCustomer from "@/pages/AddCustomer";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddCustomer />
    </ProtectedRoute>
  );
}
