"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Purchases from "@/pages/Purchases";

export default function Page() {
  return (
    <ProtectedRoute>
      <Purchases />
    </ProtectedRoute>
  );
}
