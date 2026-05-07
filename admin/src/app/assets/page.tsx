"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Assets from "@/pages/Assets";

export default function Page() {
  return (
    <ProtectedRoute>
      <Assets />
    </ProtectedRoute>
  );
}
