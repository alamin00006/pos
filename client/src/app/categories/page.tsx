"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Categories from "@/pages/Categories";

export default function Page() {
  return (
    <ProtectedRoute>
      <Categories />
    </ProtectedRoute>
  );
}
