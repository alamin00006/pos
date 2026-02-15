"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import Orders from "@/pages/Orders";

export default function Page() {
  return (
    <ProtectedRoute>
      <Orders />
    </ProtectedRoute>
  );
}
