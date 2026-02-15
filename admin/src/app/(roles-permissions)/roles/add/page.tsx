"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Role from "@/pages/RolesPermissions/Role";

export default function Page() {
  return (
    <ProtectedRoute>
      <Role />
    </ProtectedRoute>
  );
}
3;
