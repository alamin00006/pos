"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import POS from "@/pages/pos/POS";

export default function Page() {
  return (
    <ProtectedRoute>
      <POS />
    </ProtectedRoute>
  );
}
