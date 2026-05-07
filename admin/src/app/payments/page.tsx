"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Payments from "@/pages/Payments";

export default function Page() {
  return (
    <ProtectedRoute>
      <Payments />
    </ProtectedRoute>
  );
}
