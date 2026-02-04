"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddCategory from "@/pages/AddCategory";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddCategory />
    </ProtectedRoute>
  );
}
