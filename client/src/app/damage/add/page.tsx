"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddDamage from "@/pages/AddDamage";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddDamage />
    </ProtectedRoute>
  );
}
