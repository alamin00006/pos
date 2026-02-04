"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * PublicRoute: If user is already logged in, send them to /dashboard.
 * Otherwise render children (e.g., login page).
 */
export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;
  return <>{children}</>;
}
