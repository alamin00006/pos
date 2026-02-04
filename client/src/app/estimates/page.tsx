"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Estimates from "@/pages/Estimates";

export default function Page() {
  return (
    <ProtectedRoute>
      <Estimates />
    </ProtectedRoute>
  );
}
