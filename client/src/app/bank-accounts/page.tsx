"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute.tsx";
import BankAccounts from "@/pages/BankAccounts";

export default function Page() {
  return (
    <ProtectedRoute>
      <BankAccounts />
    </ProtectedRoute>
  );
}
