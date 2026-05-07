"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield } from "lucide-react";
import { useNavigate } from "@/lib/router";
import toast from "react-hot-toast";
import {
  useGetPermissionsGroupedQuery,
  useGetRoleQuery,
  useSetRolePermissionsMutation,
} from "@/redux/api/rbacApi";

type UiPermission = {
  id: string; // DB id
  label: string; // Permission name
  checked: boolean;
};

type UiSection = {
  title: string; // module
  permissions: UiPermission[];
};

const Permissions = ({ roleId }: { roleId: any }) => {
  const navigate = useNavigate();

  const {
    data: roleData,
    isLoading: roleLoading,
    isError: roleError,
  } = useGetRoleQuery(roleId) as any;

  const {
    data: grouped,
    isLoading: permLoading,
    isError: permError,
  } = useGetPermissionsGroupedQuery() as any;

  const [setRolePermissions, { isLoading: saving }] =
    useSetRolePermissionsMutation();

  const [activeTab, setActiveTab] = useState("permissions");
  const [permissions, setPermissions] = useState<UiSection[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // role existing permission DB ids
  const rolePermissionIdSet = useMemo(() => {
    const ids = roleData?.data?.permissions?.map((p) => p.id) ?? [];
    return new Set(ids);
  }, [roleData?.data?.permissions]);

  // grouped permissions and pre-check role's permissions
  useEffect(() => {
    if (!grouped?.data) return;

    const sections: UiSection[] = Object.entries(grouped?.data).map(
      ([moduleName, perms]) => ({
        title: moduleName,
        // @ts-ignore
        permissions: perms.map((p) => ({
          id: p.id, // DB id (not key)
          label: p.name || p.key,
          checked: rolePermissionIdSet.has(p.id),
        })),
      }),
    );

    setPermissions(sections);
  }, [grouped, rolePermissionIdSet]);

  // Keep selectAll in sync
  useEffect(() => {
    if (permissions.length === 0) {
      setSelectAll(false);
      return;
    }
    const allChecked = permissions.every((s) =>
      s.permissions.every((p) => p.checked),
    );
    setSelectAll(allChecked);
  }, [permissions]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setPermissions((prev) =>
      prev.map((section) => ({
        ...section,
        permissions: section.permissions.map((p) => ({ ...p, checked })),
      })),
    );
  };

  const handleSelectSection = (sectionIndex: number, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              permissions: section.permissions.map((p) => ({ ...p, checked })),
            }
          : section,
      ),
    );
  };

  const handlePermissionChange = (
    sectionIndex: number,
    permissionId: string,
    checked: boolean,
  ) => {
    setPermissions((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              permissions: section.permissions.map((p) =>
                p.id === permissionId ? { ...p, checked } : p,
              ),
            }
          : section,
      ),
    );
  };

  const isSectionFullySelected = (section: UiSection) =>
    section.permissions.every((p) => p.checked);

  const handleUpdatePermissions = async () => {
    try {
      const permissionIds = permissions
        .flatMap((s) => s.permissions)
        .filter((p) => p.checked)
        .map((p) => p.id); // ✅ DB permission ids

      if (permissionIds.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      const tId = toast.loading("Updating permissions...");

      await setRolePermissions({ roleId, permissionIds }).unwrap();

      toast.dismiss(tId);
      toast.success("Permissions updated successfully");
    } catch (err: any) {
      // RTK error shapes can differ; cover both
      const msg =
        err?.data?.message ||
        err?.data?.errors?.join?.(", ") ||
        err?.error ||
        "Failed to update permissions";

      toast.dismiss();
      toast.error(msg);
      console.error(err);
    }
  };

  const pageLoading = roleLoading || permLoading;
  const pageError = roleError || permError;

  return (
    <DashboardLayout title="Permissions">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">Permissions</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="roles"
              onClick={() => navigate("/roles")}
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Users className="w-4 h-4" />
              ROLES
            </TabsTrigger>

            <TabsTrigger
              value="permissions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Shield className="w-4 h-4" />+ PERMISSIONS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permissions" className="mt-0 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-semibold">
                Update -{" "}
                <span className="text-primary">
                  {roleData?.data?.name ?? "Role"}
                </span>{" "}
                - Permissions
              </h2>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={(checked) =>
                    handleSelectAll(Boolean(checked))
                  }
                  disabled={pageLoading || permissions.length === 0}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>

            {pageLoading && (
              <div className="text-sm text-muted-foreground">Loading...</div>
            )}

            {pageError && (
              <div className="text-sm text-red-600">
                Failed to load permissions/role data.
              </div>
            )}

            {!pageLoading && !pageError && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {permissions.map((section, sectionIndex) => (
                  <div
                    key={section.title}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                      <h3 className="font-semibold text-primary">
                        {section.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`section-${sectionIndex}`}
                          checked={isSectionFullySelected(section)}
                          onCheckedChange={(checked) =>
                            handleSelectSection(sectionIndex, Boolean(checked))
                          }
                        />
                        <label
                          htmlFor={`section-${sectionIndex}`}
                          className="text-sm text-muted-foreground cursor-pointer"
                        >
                          Select Section
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {section.permissions.map((permission) => (
                        <div
                          key={permission.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={permission.id}
                            checked={permission.checked}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(
                                sectionIndex,
                                permission.id,
                                Boolean(checked),
                              )
                            }
                          />
                          <label
                            htmlFor={permission.id}
                            className="text-sm cursor-pointer"
                          >
                            {permission.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <Button
                onClick={handleUpdatePermissions}
                size="lg"
                disabled={pageLoading || saving || permissions.length === 0}
              >
                {saving ? "Updating..." : "Update Permissions"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">POS Software</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default Permissions;
