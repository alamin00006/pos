"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Owners from "@/pages/Owners";

export default function Page() {
  return (
    <ProtectedRoute>
      <Owners />
    </ProtectedRoute>
  );
}
