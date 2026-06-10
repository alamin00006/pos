"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  AUTH_SESSION_EXPIRED_EVENT,
  AUTH_TOKEN_REFRESHED_EVENT,
  clearStoredAuthSession,
  getTokenExpiryTime,
} from "@/lib/auth/session";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { logout as logoutAction, setCredentials } from "@/redux/authSlice";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthSessionWatcher() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const handleExpiredSession = () => {
      clearStoredAuthSession();
      dispatch(logoutAction());
      router.replace("/");
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession);
    const handleTokenRefreshed = (event: Event) => {
      const accessToken = (event as CustomEvent<{ accessToken?: string }>).detail
        ?.accessToken;
      if (accessToken) {
        dispatch(setCredentials({ accessToken }));
      }
    };

    window.addEventListener(AUTH_TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleExpiredSession,
      );
      window.removeEventListener(
        AUTH_TOKEN_REFRESHED_EVENT,
        handleTokenRefreshed,
      );
    };
  }, [dispatch, router]);

  useEffect(() => {
    const expiryTime = getTokenExpiryTime(accessToken);
    if (!expiryTime) return;

    const delay = expiryTime - Date.now() - 30_000;
    if (delay <= 0) {
      refreshAccessToken().catch(() => {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refreshAccessToken().catch(() => {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
      });
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [accessToken]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AuthSessionWatcher />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
