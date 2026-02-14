"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHook";

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

  const isAuthenticated = !!accessToken && !!user;

  const hasPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((perm) => user?.permissions?.includes(perm));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (!hasPermission) {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, hasPermission, router]);

  if (!isAuthenticated) return null;
  if (!hasPermission) return null;

  return <>{children}</>;
}
