"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Expenses from "@/pages/Expenses";

export default function Page() {
  return (
    <ProtectedRoute>
      <Expenses />
    </ProtectedRoute>
  );
}
