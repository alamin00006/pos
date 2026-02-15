"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/api/categoriesApi";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categoryId: string | null;
};

const EditCategoryModal = ({ open, onOpenChange, categoryId }: Props) => {
  const shouldFetch = open && !!categoryId;

  const { data, isFetching } = useGetCategoryQuery(categoryId as string, {
    skip: !shouldFetch,
  });

  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();

  const category = data?.data; // backend: {success, data: category}

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setForm({
        name: category?.name ?? "",
        description: category?.description ?? "",
      });
    }
  }, [category]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await updateCategory({
        id: categoryId,
        name: form.name.trim(),
        description: form.description.trim() || undefined,
      }).unwrap();

      toast.success("Category updated");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updating}>
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;
