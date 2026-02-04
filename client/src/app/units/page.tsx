"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Units from "@/pages/Units";

export default function Page() {
  return (
    <ProtectedRoute>
      <Units />
    </ProtectedRoute>
  );
}
