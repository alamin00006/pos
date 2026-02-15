"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddCategory from "@/pages/categories/AddCategory";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddCategory />
    </ProtectedRoute>
  );
}
