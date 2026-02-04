"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Salary from "@/pages/Salary";

export default function Page() {
  return (
    <ProtectedRoute>
      <Salary />
    </ProtectedRoute>
  );
}
