"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Customers from "@/pages/Customers";

export default function Page() {
  return (
    <ProtectedRoute>
      <Customers />
    </ProtectedRoute>
  );
}
