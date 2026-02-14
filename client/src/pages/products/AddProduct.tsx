"use client";

import React, { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus } from "lucide-react";

import AddCategoryModal from "@/components/AddCategoryModal";
import AddSubcategoryModal from "@/components/AddSubcategoryModal";
import AddBrandModal from "@/components/AddBrandModal";
import RichTextEditor from "@/components/RichTextEditor";

import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";

import { useCreateProductMutation } from "@/redux/api/productsApi";
import { useGetSubcategoriesQuery } from "@/redux/api/subcategoriesApi";
import { useGetUnitsQuery } from "@/redux/api/unitsApi";

type SelectOption = { id: string; name: string };

const toNum = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const { data: categoriesRes, isLoading: categoriesLoading } =
    useGetCategoriesQuery({ page: 1, limit: 500 });

  const { data: subcategoriesRes, isLoading: subcategoriesLoading } =
    useGetSubcategoriesQuery({ page: 1, limit: 500 });

  const { data: brandsRes, isLoading: brandsLoading } = useGetBrandsQuery({
    page: 1,
    limit: 500,
  });

  const { data: unitsRes, isLoading: unitsLoading } = useGetUnitsQuery({
    page: 1,
    limit: 500,
  });

  const categories: SelectOption[] = categoriesRes?.data ?? [];
  const subcategories: (SelectOption & { categoryId?: string | null })[] =
    subcategoriesRes?.data?.data ?? [];
  const brands: SelectOption[] = brandsRes?.data ?? [];
  const units: any[] = unitsRes?.data ?? [];

  console.log(brands);
  // -----------------------------
  // Mutations
  // -----------------------------
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    barcode: "",
    description: "",

    categoryId: "",
    subcategoryId: "",
    brandId: "",
    unitId: "",

    costPrice: "",
    sellPrice: "",
    alertQuantity: "10",

    openingStock: "",

    imageFile: null as File | null,
  });

  // ✅ Filter subcategories based on categoryId
  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter((s) => s.categoryId === formData.categoryId);
  }, [subcategories, formData.categoryId]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    if (field === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        subcategoryId: "", // reset subcategory
      }));
      return;
    }

    if (field === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: value as File | null }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // -----------------------------
  // ✅ Submit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim()) {
      toast({ title: "Name required", description: "Product name দিন।" });
      return;
    }
    if (!formData.productCode.trim()) {
      toast({
        title: "Product code required",
        description: "Product code দিন।",
      });
      return;
    }

    try {
      // ✅ Optional: upload image first -> get url
      // let imageUrl: string | undefined = undefined;
      // if (formData.imageFile) {
      //   const fd = new FormData();
      //   fd.append("file", formData.imageFile);
      //   const uploadRes = await uploadFile(fd).unwrap(); // ApiResponse<{ url: string }>
      //   imageUrl = uploadRes.data.url;
      // }

      const payload = {
        name: formData.name.trim(),
        productCode: formData.productCode.trim(),
        barcode: formData.barcode.trim() ? formData.barcode.trim() : undefined,
        description: formData.description || undefined,

        costPrice: toNum(formData.costPrice),
        sellPrice: toNum(formData.sellPrice),
        alertQuantity: Math.max(
          0,
          parseInt(formData.alertQuantity || "10", 10) || 10,
        ),

        categoryId: formData.categoryId || undefined,
        subcategoryId: formData.subcategoryId || undefined,
        brandId: formData.brandId || undefined,
        unitId: formData.unitId || undefined,

        // image: imageUrl, // optional
      };

      const created = await createProduct(payload as any).unwrap();

      // ✅ Optional: opening stock -> stock ledger entry
      // const openingQty = parseInt(formData.openingStock || "0", 10) || 0;
      // if (openingQty > 0) {
      //   await createOpeningStock({
      //     productId: created.data.id,
      //     quantity: openingQty,
      //     note: "Opening stock",
      //   }).unwrap();
      // }

      toast({
        title: "Product Added",
        description: `${created.data.name} added successfully.`,
      });

      navigate("/products");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Something went wrong while creating product.";
      toast({ title: "Failed", description: msg, variant: "destructive" });
    }
  };

  // -----------------------------
  // ✅ Modal callbacks (আপনার modals যেভাবে return দেয় সেভাবে adjust)
  // -----------------------------
  const handleCategoryAdded = (category: { id: string; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
      subcategoryId: "",
    }));
  };

  const handleSubcategoryAdded = (subcategory: {
    id: string;
    name: string;
    categoryId: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: subcategory.categoryId || prev.categoryId,
      subcategoryId: subcategory.id,
    }));
  };

  const handleBrandAdded = (brand: { id: string; name: string }) => {
    setFormData((prev) => ({ ...prev, brandId: brand.id }));
  };

  const isAnyLoading =
    categoriesLoading || subcategoriesLoading || brandsLoading || unitsLoading;

  return (
    <DashboardLayout title="New Product">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger
            value="products"
            onClick={() => navigate("/products")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            PRODUCTS
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            + ADD PRODUCT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">New Product</h3>

              {isAnyLoading && (
                <p className="text-sm text-muted-foreground mb-4">
                  Loading dropdown data...
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Product Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter Product Name.."
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                  />
                </div>

                {/* Product Code */}
                <div className="space-y-2">
                  <Label htmlFor="productCode">
                    Product Code<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="productCode"
                    placeholder="Enter Product Code.."
                    value={formData.productCode}
                    onChange={(e) =>
                      handleChange("productCode", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Barcode */}
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    placeholder="Enter barcode (optional)"
                    value={formData.barcode}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="categoryId">
                    Category<span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-3">
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) =>
                        handleChange("categoryId", value)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => setShowCategoryModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Category
                    </Button>
                  </div>
                </div>

                {/* Subcategory */}
                <div className="space-y-2">
                  <Label htmlFor="subcategoryId">Subcategory</Label>
                  <div className="flex gap-3">
                    <Select
                      value={formData.subcategoryId}
                      onValueChange={(value) =>
                        handleChange("subcategoryId", value)
                      }
                      disabled={!formData.categoryId}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue
                          placeholder={
                            formData.categoryId
                              ? "Select Subcategory"
                              : "Select category first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.length > 0 ? (
                          filteredSubcategories.map((sub) => (
                            <SelectItem key={sub.id} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No subcategories found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => setShowSubcategoryModal(true)}
                      disabled={!formData.categoryId}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Subcategory
                    </Button>
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <Label htmlFor="brandId">Brand</Label>
                  <div className="flex gap-3">
                    <Select
                      value={formData.brandId}
                      onValueChange={(value) => handleChange("brandId", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((b) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => setShowBrandModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Brand
                    </Button>
                  </div>
                </div>

                {/* Unit */}
                <div className="space-y-2">
                  <Label htmlFor="unitId">Unit</Label>
                  <Select
                    value={formData.unitId}
                    onValueChange={(value) => handleChange("unitId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Opening Stock (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="openingStock">Opening Stock (Optional)</Label>
                  <Input
                    id="openingStock"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.openingStock}
                    onChange={(e) =>
                      handleChange("openingStock", e.target.value)
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Opening stock দিতে চাইলে backend এ stockLedger entry লাগবে।
                  </p>
                </div>

                {/* Sell Price */}
                <div className="space-y-2">
                  <Label htmlFor="sellPrice">
                    Sell Price<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Enter sell price.."
                    value={formData.sellPrice}
                    onChange={(e) => handleChange("sellPrice", e.target.value)}
                    required
                  />
                </div>

                {/* Cost Price */}
                <div className="space-y-2">
                  <Label htmlFor="costPrice">
                    Cost Price<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="costPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Enter cost price.."
                    value={formData.costPrice}
                    onChange={(e) => handleChange("costPrice", e.target.value)}
                    required
                  />
                </div>

                {/* Alert Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="alertQuantity">Alert Quantity</Label>
                  <Input
                    id="alertQuantity"
                    type="number"
                    min={0}
                    placeholder="10"
                    value={formData.alertQuantity}
                    onChange={(e) =>
                      handleChange("alertQuantity", e.target.value)
                    }
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Product Details</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => handleChange("description", value)}
                    placeholder="Enter product details..."
                  />
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label htmlFor="imageFile">Product Image</Label>
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleChange("imageFile", e.target.files?.[0] || null)
                    }
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Image upload endpoint থাকলে upload করে URL সেট করুন।
                  </p>
                </div>

                {/* Save */}
                <div className="flex justify-center pt-4">
                  <Button type="submit" className="px-8" disabled={creating}>
                    <Save className="w-4 h-4 mr-2" />
                    {creating ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddCategoryModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        onCategoryAdded={handleCategoryAdded as any}
      />
      <AddSubcategoryModal
        open={showSubcategoryModal}
        onOpenChange={setShowSubcategoryModal}
        categories={categories.map((c) => ({ value: c.id, label: c.name }))}
        selectedCategory={formData.categoryId}
        onSubcategoryAdded={handleSubcategoryAdded as any}
      />
      <AddBrandModal
        open={showBrandModal}
        onOpenChange={setShowBrandModal}
        onBrandAdded={handleBrandAdded as any}
      />
    </DashboardLayout>
  );
};

export default AddProduct;
