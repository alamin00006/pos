"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Products from "@/pages/Products";

export default function Page() {
  return (
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  );
}
