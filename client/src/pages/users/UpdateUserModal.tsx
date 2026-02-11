"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import toast from "react-hot-toast";
import { useGetRolesQuery } from "@/redux/api/roleApi";
import {
  useAssignRoleToUserMutation,
  useGetUserByIdQuery,
  useRemoveRoleFromUserMutation,
  useUpdateUserMutation,
} from "@/redux/api/usersApi";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string | null;
  roles: any[];
};

export default function UpdateUserModal({
  open,
  onOpenChange,
  userId,
  roles = [],
}: Props) {
  const { data: userRes, isFetching } = useGetUserByIdQuery(userId!, {
    skip: !userId || !open,
  }) as any;

  const [updateUser, { isLoading: updating }] = useUpdateUserMutation() as any;
  const [assignRole, { isLoading: assigning }] =
    useAssignRoleToUserMutation() as any;
  const [removeRole, { isLoading: removing }] =
    useRemoveRoleFromUserMutation() as any;

  const user = userRes?.data;

  const currentRoleIds: string[] = useMemo(() => {
    // backend findOne returns roles: role objects
    const r = user?.roles ?? [];
    return Array.isArray(r) ? r.map((x: any) => x.id) : [];
  }, [user]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    isActive: true,

    roleId: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm((p) => ({
      ...p,
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      isActive: !!user.isActive,

      roleId: currentRoleIds?.[0] ?? "", // single select UI
    }));
  }, [user, currentRoleIds]);

  const onChange = (k: keyof typeof form, v: string | boolean) => {
    setForm((p) => ({ ...p, [k]: v as any }));
  };

  const handleUpdate = async () => {
    if (!userId) return;

    try {
      // 1) basic update (name/email/phone/isActive/password optional)
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        isActive: form.isActive,
      };

      await updateUser({ id: userId, data: payload }).unwrap();

      // 2) role update (single role select) -> assign/remove via endpoints
      const selectedRoleId = form.roleId || null;

      // remove old roles (if you want strict single role)
      const oldRoleIds = currentRoleIds ?? [];
      const toRemove = selectedRoleId
        ? oldRoleIds.filter((id) => id !== selectedRoleId)
        : oldRoleIds;

      for (const rid of toRemove) {
        await removeRole({ id: userId, roleId: rid }).unwrap();
      }

      // assign selected if missing
      if (selectedRoleId && !oldRoleIds.includes(selectedRoleId)) {
        await assignRole({ id: userId, roleId: selectedRoleId }).unwrap();
      }

      toast.success("User updated successfully");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update user");
    }
  };

  const busy = updating || assigning || removing || isFetching;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>

        {busy && !user ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => onChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.roleId}
                onValueChange={(v) => onChange("roleId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r: any) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                (Single role mode: old roles removed)
              </p>
            </div>

            <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
              <div>
                <p className="text-sm font-medium">Active</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => onChange("isActive", v)}
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={busy || !userId}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
