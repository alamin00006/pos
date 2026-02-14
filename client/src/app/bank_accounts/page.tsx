"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BankAccounts from "@/pages/BankAccounts";
import { usePathname } from "next/navigation";

export default function Page() {
  const pathName = usePathname();
  console.log(pathName);
  return (
    <ProtectedRoute requiredPermissions={["add_bank_account"]}>
      <BankAccounts />
    </ProtectedRoute>
  );
}
