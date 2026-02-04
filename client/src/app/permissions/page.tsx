"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Permissions from "@/pages/Permissions";

export default function Page() {
  return (
    <ProtectedRoute>
      <Permissions />
    </ProtectedRoute>
  );
}
