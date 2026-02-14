"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useNavigate } from "@/lib/router";

import { useCreateCategoryMutation } from "@/redux/api/categoriesApi";

const AddCategory = () => {
  const navigate = useNavigate();

  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const resetForm = () =>
    setFormData({
      name: "",
      description: "",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter category name");
      return;
    }

    try {
      await createCategory({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      }).unwrap();

      toast.success("Category added successfully!");
      resetForm();
      navigate("/categories");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.data?.error || "Failed to add category",
      );
    }
  };

  return (
    <DashboardLayout title="Add Category">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter category description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Category"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
              >
                Reset
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/categories")}
                disabled={isLoading}
              >
                Back
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddCategory;
