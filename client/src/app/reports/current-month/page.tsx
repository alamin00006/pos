"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import TodayReport from "@/pages/TodayReport";

export default function Page() {
  return (
    <ProtectedRoute>
      <TodayReport />
    </ProtectedRoute>
  );
}
