"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddProduct from "@/pages/AddProduct";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddProduct />
    </ProtectedRoute>
  );
}
