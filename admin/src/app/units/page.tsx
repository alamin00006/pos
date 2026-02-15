"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Units from "@/pages/units/Units";

export default function Page() {
  return (
    <ProtectedRoute>
      <Units />
    </ProtectedRoute>
  );
}
