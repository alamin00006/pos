"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Purchases from "@/pages/Purchases";

export default function Page() {
  return (
    <ProtectedRoute>
      <Purchases />
    </ProtectedRoute>
  );
}
