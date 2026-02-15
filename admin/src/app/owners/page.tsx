"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Owners from "@/pages/owners/Owners";

export default function Page() {
  return (
    <ProtectedRoute requiredPermissions={["owner_list"]}>
      <Owners />
    </ProtectedRoute>
  );
}
