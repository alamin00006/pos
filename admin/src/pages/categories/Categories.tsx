"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Edit, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
} from "@/redux/api/categoriesApi";
import EditCategoryModal from "./EditCategoryModal";

const Categories = () => {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const openEdit = (id: string) => {
    setEditId(id);
    setEditOpen(true);
  };

  useEffect(() => {
    if (!editOpen) setEditId(null);
  }, [editOpen]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  // API call (server side search + pagination)
  const { data, isLoading, isFetching } = useGetCategoriesQuery({
    page,
    limit,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const categories = data?.data ?? [];
  const meta = data?.data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  return (
    <DashboardLayout title="Categories">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center justify-between gap-6 border-b border-border pb-3">
          <div className="flex gap-6">
            <button className="pb-2 px-1 text-sm font-medium text-primary border-b-2 border-primary">
              CATEGORIES
            </button>
            <button
              onClick={() => navigate("/categories/add")}
              className="pb-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              + ADD CATEGORY
            </button>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Categories</h3>
              {(isFetching || deleting) && (
                <span className="text-xs text-muted-foreground">
                  Loading...
                </span>
              )}
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">
                    #
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Description
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold">
                    Products
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10">
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category: any, idx: number) => (
                    <TableRow key={category.id}>
                      <TableCell>{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell className="text-primary font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{category.description ?? "-"}</TableCell>
                      <TableCell>{category.productsCount ?? 0}</TableCell>

                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Settings className="w-4 h-4 mr-1" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => openEdit(category.id)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(category.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Simple pagination */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} (Total: {meta?.total ?? 0})
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <EditCategoryModal
          open={editOpen}
          onOpenChange={setEditOpen}
          categoryId={editId}
        />
      </div>
    </DashboardLayout>
  );
};

export default Categories;
