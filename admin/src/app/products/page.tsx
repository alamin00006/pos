"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Products from "@/pages/products/Products";

export default function Page() {
  return (
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  );
}
