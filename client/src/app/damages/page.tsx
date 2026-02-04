"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Damages from "@/pages/Damages";

export default function Page() {
  return (
    <ProtectedRoute>
      <Damages />
    </ProtectedRoute>
  );
}
