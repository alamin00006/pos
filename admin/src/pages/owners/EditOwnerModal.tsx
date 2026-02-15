"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Save, X } from "lucide-react";
import { useUpdateOwnerMutation } from "@/redux/api/ownerApi";
import toast from "react-hot-toast";

type Owner = {
  id: string;
  name: string;
  phone?: string;
  mobile?: string;
  address?: string | null;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  owner: Owner | null; // row data from table
  refetch: () => void;
};

export default function EditOwnerModal({
  open,
  onOpenChange,
  owner,
  refetch,
}: Props) {
  const [updateOwner, { isLoading }] = useUpdateOwnerMutation();

  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    address: "",
  });

  // when modal opens / owner changes, preload form
  React.useEffect(() => {
    if (!open || !owner) return;

    setForm({
      name: owner.name ?? "",
      phone: (owner.phone ?? owner.mobile ?? "") as string,
      address: owner.address ?? "",
    });
  }, [open, owner]);

  const canSubmit =
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 11 &&
    form.address.trim().length >= 3;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner) return;
    if (!canSubmit) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    try {
      await updateOwner({
        id: owner.id,
        body: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        },
      }).unwrap();

      toast.success("Owner updated successfully.");
      onOpenChange(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.errors?.join(", ") || "Failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Owner</DialogTitle>
        </DialogHeader>

        {!owner ? (
          <div className="text-sm text-muted-foreground">No owner selected</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="rounded-sm"
                  placeholder="Owner name"
                />
                {form.name.trim() && form.name.trim().length < 2 && (
                  <p className="text-xs text-destructive">
                    Name must be at least 2 characters
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Phone <span className="text-destructive">*</span>
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="rounded-sm"
                  placeholder="01XXXXXXXXX"
                />
                {form.phone.trim() && form.phone.trim().length < 11 && (
                  <p className="text-xs text-destructive">
                    Phone must be at least 11 digits
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Address <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
                className="rounded-sm min-h-[120px] resize-none"
                placeholder="Full address"
              />
              {form.address.trim() && form.address.trim().length < 3 && (
                <p className="text-xs text-destructive">
                  Address must be at least 3 characters
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 cursor-pointer">
              <Button
                type="button"
                variant="outline"
                className="rounded-sm"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              <Button
                type="submit"
                className="rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                disabled={!canSubmit || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
