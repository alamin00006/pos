"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddUnit from "@/pages/units/AddUnit";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddUnit />
    </ProtectedRoute>
  );
}
