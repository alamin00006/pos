"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Users from "@/pages/Users";

export default function Page() {
  return (
    <ProtectedRoute>
      <Users />
    </ProtectedRoute>
  );
}
