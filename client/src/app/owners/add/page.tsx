"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddOwner from "@/pages/owners/AddOwner";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddOwner />
    </ProtectedRoute>
  );
}
