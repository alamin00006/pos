"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import EstimateManage from "@/pages/EstimateManage";

export default function Page() {
  return (
    <ProtectedRoute>
      <EstimateManage />
    </ProtectedRoute>
  );
}
