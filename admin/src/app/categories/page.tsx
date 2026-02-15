"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Categories from "@/pages/categories/Categories";

export default function Page() {
  return (
    <ProtectedRoute>
      <Categories />
    </ProtectedRoute>
  );
}
