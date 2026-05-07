"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHook";

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();

  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isRehydrated = useAppSelector(
    (state: any) => state._persist?.rehydrated ?? true,
  );

  const isAuthenticated = Boolean(accessToken && user);

  useEffect(() => {
    if (!isRehydrated) return;

    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isRehydrated, router]);

  if (!isRehydrated) return null;
  if (isAuthenticated) return null;

  return <>{children}</>;
}
