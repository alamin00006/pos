"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Settings from "@/pages/Settings";

export default function Page() {
  return (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  );
}
