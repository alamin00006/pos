"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Save,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Search,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from "@/redux/api/brandsApi";

import type { Brand } from "@/types/brand";

type Tab = "list" | "add";

const Brands = () => {
  const [activeTab, setActiveTab] = useState<Tab>("list");

  // server paging
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // filter/search
  const [filterName, setFilterName] = useState("");

  // create form
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  /** =============================
   * API
   ============================= */
  const { data, isLoading, isFetching, refetch } = useGetBrandsQuery(
    {
      page,
      limit,
      search: filterName || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { refetchOnMountOrArgChange: true },
  );

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  const [deleteBrand, { isLoading: isDeleting }] = useDeleteBrandMutation();

  const brands = data?.data ?? [];
  const meta = data?.meta;

  const totalPages = meta?.totalPages ?? 1;

  /** =============================
   * Logo preview
   ============================= */
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBrandLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setBrandLogo(null);
    setLogoPreview(null);
  };

  /** =============================
   * Create
   ============================= */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      // ✅ backend dto only: name, description
      await createBrand({
        name: brandName.trim(),
        description: brandDescription?.trim() || undefined,
      }).unwrap();

      toast.success("Brand added successfully");
      setBrandName("");
      setBrandDescription("");
      clearLogo(); // (logo currently UI-only)

      setActiveTab("list");
      setPage(1);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create brand");
    }
  };

  /** =============================
   * Delete
   ============================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteBrand(id).unwrap();
      toast.success("Brand deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete brand");
    }
  };

  /** =============================
   * Edit
   ============================= */
  const openEdit = (b: Brand) => {
    setEditingBrand(b);
    setEditName(b.name ?? "");
    setEditDescription((b.description as any) ?? "");
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingBrand) return;

    if (!editName.trim()) {
      toast.error("Brand name is required");
      return;
    }

    try {
      await updateBrand({
        id: editingBrand.id,
        data: {
          name: editName.trim(),
          description: editDescription?.trim() || undefined,
        },
      }).unwrap();

      toast.success("Brand updated");
      setIsEditOpen(false);
      setEditingBrand(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update brand");
    }
  };

  /** =============================
   * When search changes -> reset page
   ============================= */
  useEffect(() => {
    setPage(1);
  }, [filterName, limit]);

  return (
    <DashboardLayout title="Brands">
      <div className="bg-card rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "list"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              BRANDS
              {activeTab === "list" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "add"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + ADD BRAND
              {activeTab === "add" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* ================== LIST ================== */}
        {activeTab === "list" ? (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Entries</Label>
                <Select
                  value={String(limit)}
                  onValueChange={(v) => setLimit(Number(v))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">SL</TableHead>
                    <TableHead className="font-semibold">Brand Name</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Products</TableHead>
                    <TableHead className="font-semibold text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading || isFetching ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : brands.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No brands found
                      </TableCell>
                    </TableRow>
                  ) : (
                    brands.map((brand, index) => (
                      <TableRow key={brand.id}>
                        <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {brand.name}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {brand.description || "-"}
                        </TableCell>
                        <TableCell>{brand.productsCount ?? 0}</TableCell>

                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toast("View is optional")}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => openEdit(brand)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(brand.id)}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {meta?.page ?? page} of {meta?.totalPages ?? totalPages} •
                Total {meta?.total ?? brands.length}
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                    .map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={page === p}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        ) : (
          /* ================== ADD ================== */
          <div className="p-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-6">New Brand</h3>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">
                      Brand Name<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brandName"
                      placeholder="Enter Brand Name..."
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Logo UI-only (backend doesn't accept in DTO right now) */}
                  <div className="space-y-2">
                    <Label htmlFor="brandLogo">Brand Logo (optional)</Label>

                    <div className="flex items-center gap-2">
                      {logoPreview ? (
                        <div className="relative">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-16 h-16 object-contain rounded border"
                          />
                          <button
                            type="button"
                            onClick={clearLogo}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Choose file...
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    {brandLogo && (
                      <p className="text-xs text-muted-foreground">
                        Selected: {brandLogo.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandDescription">Brand Description</Label>
                  <Textarea
                    id="brandDescription"
                    placeholder="Enter Brand Description..."
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-center">
                  <Button type="submit" className="px-8" disabled={isCreating}>
                    <Save className="w-4 h-4 mr-2" />
                    {isCreating ? "Saving..." : "Save Brand"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ================== EDIT MODAL ================== */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Brands;
