"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AddEstimate from "@/pages/AddEstimate";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddEstimate />
    </ProtectedRoute>
  );
}
