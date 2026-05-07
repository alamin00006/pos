"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BankAccounts from "@/pages/BankAccounts";

export default function Page() {
  return (
    <ProtectedRoute requiredPermissions={["add_bank_account"]}>
      <BankAccounts />
    </ProtectedRoute>
  );
}
