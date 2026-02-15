"use client";

import PublicRoute from "@/components/auth/PublicRoute";
import Index from "@/pages/Index";

export default function Page() {
  return (
    <PublicRoute>
      <Index />
    </PublicRoute>
  );
}
