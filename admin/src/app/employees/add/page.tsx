"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Employees from "@/pages/Employees";

export default function Page() {
  return (
    <ProtectedRoute>
      <Employees />
    </ProtectedRoute>
  );
}
