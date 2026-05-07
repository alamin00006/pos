"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Suppliers from "@/pages/suppliers/Suppliers";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suppliers />
    </ProtectedRoute>
  );
}
