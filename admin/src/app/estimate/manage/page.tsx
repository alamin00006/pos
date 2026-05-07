"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import EstimateManage from "@/pages/EstimateManage";

export default function Page() {
  return (
    <ProtectedRoute>
      <EstimateManage />
    </ProtectedRoute>
  );
}
