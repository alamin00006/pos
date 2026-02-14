import { useAppSelector } from "@/hooks/reduxHook";

export const usePermission = () => {
  const permissions = useAppSelector(
    (state) => state.auth.user?.permissions || [],
  );

  const hasPermission = (key: string) => {
    return permissions.includes(key);
  };

  return { hasPermission };
};
