"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import POS from "@/pages/POS";

export default function Page() {
  return (
    <ProtectedRoute>
      <POS />
    </ProtectedRoute>
  );
}
