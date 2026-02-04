"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Sales from "@/pages/Sales";

export default function Page() {
  return (
    <ProtectedRoute>
      <Sales />
    </ProtectedRoute>
  );
}
