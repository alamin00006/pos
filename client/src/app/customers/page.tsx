"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Customers from "@/pages/Customers";

export default function Page() {
  return (
    <ProtectedRoute>
      <Customers />
    </ProtectedRoute>
  );
}
