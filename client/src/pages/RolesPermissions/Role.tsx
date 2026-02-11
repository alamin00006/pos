"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, List } from "lucide-react";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "@/redux/api/roleApi";
import toast from "react-hot-toast";
import { useGetOwnersQuery } from "@/redux/api/ownerApi";
import { useNavigate } from "@/lib/router";

type RoleRow = {
  id: string;
  name: string;
  usersCount: number;
};

export default function Role() {
  const navigate = useNavigate();

  const {
    data: roles,
    isLoading: roleGetLoading,
    isError,
    refetch,
  } = useGetRolesQuery() as any;

  const [createRole, { isLoading }] = useCreateRoleMutation();

  const [deleteRole, { isLoading: deleteLoading }] = useDeleteRoleMutation();

  const [roleName, setRoleName] = useState("");

  const canAdd = roleName.trim().length >= 2;

  const onAddRole = async () => {
    if (!canAdd) return;

    try {
      const data = await createRole({ name: roleName }).unwrap();
      toast.success(data?.message || "Role added successfully.");
      setRoleName("");
      // navigate("/owners");
    } catch (err: any) {
      toast.error(err?.data?.errors?.join(", ") || err?.data?.message);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this owner?")) return;
    try {
      await deleteRole(id).unwrap();
      toast.success("Role deleted successfully.");
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Something went wrong");
    }
  };

  const rows = useMemo(() => roles?.data ?? [], [roles?.data]);

  return (
    <DashboardLayout title="Roles & Permissions">
      <div className="space-y-6">
        {/* Title */}
        <h1 className="text-4xl font-semibold text-foreground">
          Roles &amp; Permissions
        </h1>

        {/* Add Role box (like screenshot) */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Add Role</h2>
          </div>

          <div className="px-6 py-6">
            <label className="text-xs font-medium text-muted-foreground block mb-2">
              Role Name
            </label>

            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name..."
                className="h-10 rounded-sm bg-background"
              />

              <Button
                type="button"
                onClick={onAddRole}
                disabled={!canAdd}
                className="h-10 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground md:w-32"
              >
                Add Role
              </Button>
            </div>

            {roleName.trim() && roleName.trim().length < 2 && (
              <p className="mt-2 text-xs text-destructive">
                Role name must be at least 2 characters.
              </p>
            )}
          </div>
        </div>

        {/* Roles table box (like screenshot) */}
        <div className="rounded-sm border border-border bg-card shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Roles</h2>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto border border-border rounded-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground w-20 text-center">
                      #
                    </TableHead>
                    <TableHead className="text-primary-foreground text-center">
                      Role
                    </TableHead>
                    <TableHead className="text-primary-foreground text-center">
                      Users
                    </TableHead>
                    <TableHead className="text-primary-foreground w-40 text-center">
                      #
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((r, idx) => (
                    <TableRow key={r.id} className="hover:bg-muted/40">
                      <TableCell className="text-center text-muted-foreground">
                        {idx + 1}
                      </TableCell>

                      <TableCell className="text-center font-medium text-foreground">
                        {r.name}
                      </TableCell>

                      <TableCell className="text-center text-foreground">
                        {r.usersCount}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-2">
                          {/* permissions/list button (like first icon) */}
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-sm"
                            title="Role Permission List"
                            onClick={() => {
                              navigate(`/permissions/${r.id}`);
                            }}
                          >
                            <List className="h-4 w-4" />
                          </Button>

                          {/* edit button */}
                          <Button
                            type="button"
                            size="icon"
                            className="h-8 w-8 rounded-sm bg-sky-500 hover:bg-sky-600 text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* delete button */}
                          <Button
                            type="button"
                            size="icon"
                            className="h-8 w-8 rounded-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            onClick={() => onDelete(r.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        <div className="text-sm text-muted-foreground">
                          No roles found
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* keep Card import used */}
        <Card className="hidden" />
      </div>
    </DashboardLayout>
  );
}
