"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import AddEstimate from "@/pages/AddEstimate";

export default function Page() {
  return (
    <ProtectedRoute>
      <AddEstimate />
    </ProtectedRoute>
  );
}
