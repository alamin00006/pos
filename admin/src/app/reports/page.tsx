"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Reports from "@/pages/Reports";

export default function Page() {
  return (
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  );
}
