"use client";

import { usePathname, useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { AnchorHTMLAttributes, ForwardedRef, createElement, forwardRef } from "react";

/**
 * Next router helpers to replace common react-router-dom hooks.
 */
export function useNavigate() {
  const router = useRouter();
  return (to: string) => router.push(to);
}

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();
  return {
    pathname,
    search: search ? `?${search}` : "",
    hash: "",
    state: null,
  } as const;
}

export function useRRParams<T extends Record<string, string | string[]>>() {
  return useParams() as unknown as T;
}

export function useSearch() {
  const sp = useSearchParams();
  return sp;
}

export type NavLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  to: string;
  className?:
    | string
    | ((state: { isActive: boolean; isPending: boolean }) => string | undefined);
};

export const NavLink = forwardRef(function NavLink(
  { to, className, ...props }: NavLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  const pathname = usePathname();
  const isActive = pathname === to || pathname?.startsWith(`${to}/`);
  const computedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false })
      : className;

  return createElement(Link, {
    ref,
    href: to,
    className: computedClassName,
    ...props,
  });
});
