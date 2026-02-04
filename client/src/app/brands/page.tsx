"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Brands from "@/pages/Brands";

export default function Page() {
  return (
    <ProtectedRoute>
      <Brands />
    </ProtectedRoute>
  );
}
