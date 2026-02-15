"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Suppliers from "@/pages/Suppliers";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suppliers />
    </ProtectedRoute>
  );
}
