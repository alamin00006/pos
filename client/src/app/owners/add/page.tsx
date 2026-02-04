"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddOwner from "@/pages/AddOwner";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddOwner />
    </ProtectedRoute>
  );
}
