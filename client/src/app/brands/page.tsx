"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Brands from "@/pages/brands/Brands";

export default function Page() {
  return (
    <ProtectedRoute>
      <Brands />
    </ProtectedRoute>
  );
}
