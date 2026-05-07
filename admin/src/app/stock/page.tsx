"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Stock from "@/pages/Stock";

export default function Page() {
  return (
    <ProtectedRoute>
      <Stock />
    </ProtectedRoute>
  );
}
