"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Subcategories from "@/pages/subCategories/Subcategories";

export default function Page() {
  return (
    <ProtectedRoute>
      <Subcategories />
    </ProtectedRoute>
  );
}
