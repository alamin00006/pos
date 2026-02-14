"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BankAccounts from "@/pages/BankAccounts";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <ProtectedRoute requiredPermissions={["bank_accounts"]}>
      <BankAccounts />
    </ProtectedRoute>
  );
}
