"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Users from "@/pages/users/Users";

export default function Page() {
  return (
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  );
}
