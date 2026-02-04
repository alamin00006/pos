"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddUnit from "@/pages/AddUnit";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddUnit />
    </ProtectedRoute>
  );
}
