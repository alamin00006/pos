"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddProduct from "@/pages/products/AddProduct";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddProduct />
    </ProtectedRoute>
  );
}
