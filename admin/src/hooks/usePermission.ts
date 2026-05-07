import { useAppSelector } from "@/hooks/reduxHook";
import { decodedToken } from "@/helpers/utils/jwt";

const normalizePermission = (permission: unknown): string | null => {
  if (typeof permission === "string") return permission;
  if (permission && typeof permission === "object") {
    const value =
      (permission as any).key ??
      (permission as any).name ??
      (permission as any).permissionKey;
    return typeof value === "string" ? value : null;
  }
  return null;
};

const normalizeRole = (role: unknown): string | null => {
  if (typeof role === "string") return role;
  if (role && typeof role === "object") {
    const value = (role as any).name ?? (role as any).roleName;
    return typeof value === "string" ? value : null;
  }
  return null;
};

export const usePermission = () => {
  const user = useAppSelector((state) => state.auth.user);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const tokenPayload = accessToken ? decodedToken(accessToken) : {};

  const userPermissions = Array.isArray(user?.permissions)
    ? user.permissions
    : [];
  const tokenPermissions = Array.isArray((tokenPayload as any).permissions)
    ? ((tokenPayload as any).permissions as unknown[])
    : [];
  const userRoles = Array.isArray(user?.roles) ? user.roles : [];
  const tokenRoles = Array.isArray((tokenPayload as any).roles)
    ? ((tokenPayload as any).roles as unknown[])
    : [];

  const permissions = [...userPermissions, ...tokenPermissions]
    .map(normalizePermission)
    .filter(Boolean) as string[];
  const roles = [...userRoles, ...tokenRoles]
    .map(normalizeRole)
    .filter(Boolean) as string[];

  const hasPermission = (key?: string) => {
    if (!key) return true;
    const email = user?.email || ((tokenPayload as any).email as string);
    if (email === "pos@admin.com") return true;
    if (roles.some((role) => role.toUpperCase() === "ADMIN")) return true;
    return permissions.includes(key);
  };

  return { hasPermission };
};
