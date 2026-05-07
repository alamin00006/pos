"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Backup from "@/pages/Backup";

export default function Page() {
  return (
    <ProtectedRoute>
      <Backup />
    </ProtectedRoute>
  );
}
