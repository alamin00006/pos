"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHook";
import { usePermission } from "@/hooks/usePermission";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export default function ProtectedRoute({
  children,
  requiredPermissions = [],
}: ProtectedRouteProps) {
  const router = useRouter();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const { hasPermission } = usePermission();

  const isAuthenticated = !!accessToken && !!user;

  //  Permission check using hook
  const hasRequiredPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((perm) => hasPermission(perm));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!hasRequiredPermission) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, hasRequiredPermission, router]);

  if (!isAuthenticated) return null;
  if (!hasRequiredPermission) return null;

  return <>{children}</>;
}
