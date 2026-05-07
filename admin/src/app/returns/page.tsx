"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Returns from "@/pages/Returns";

export default function Page() {
  return (
    <ProtectedRoute>
      <Returns />
    </ProtectedRoute>
  );
}
