"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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

import { PackageCheck, Save, Plus, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

import AddCategoryModal from "@/components/AddCategoryModal";
import AddSubcategoryModal from "@/components/AddSubcategoryModal";
import AddBrandModal from "@/components/AddBrandModal";
import RichTextEditor from "@/components/RichTextEditor";

import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";
import { useGetSubcategoriesQuery } from "@/redux/api/subcategoriesApi";
import { useGetUnitsQuery } from "@/redux/api/unitsApi";

import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "@/redux/api/productsApi";

type SelectOption = { id: string; name: string };

const toNum = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const EditProduct = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ? String(params.id) : "";

  const navigate = useNavigate();

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

  const categories: SelectOption[] = (categoriesRes?.data ?? []) as any;
  const subcategories: (SelectOption & { categoryId?: string | null })[] =
    (subcategoriesRes?.data?.data ?? []) as any;
  const brands: SelectOption[] = (brandsRes?.data ?? []) as any;
  const units: any[] = (unitsRes?.data ?? []) as any;

  const {
    data: productRes,
    isLoading: productLoading,
    isFetching: productFetching,
    error: productError,
    refetch,
  } = useGetProductQuery(id, { skip: !id }) as any;

  const product = productRes?.data;

  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

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

  // Hydrate form once product loads
  useEffect(() => {
    if (!product) return;

    setFormData((prev) => ({
      ...prev,
      name: String(product?.name ?? ""),
      productCode: String(
        product?.productCode ?? product?.product_code ?? product?.code ?? "",
      ),
      barcode: String(product?.barcode ?? ""),
      description: String(product?.description ?? product?.details ?? ""),

      categoryId: String(
        product?.categoryId ??
          product?.category_id ??
          product?.category?.id ??
          "",
      ),
      subcategoryId: String(
        product?.subcategoryId ??
          product?.subcategory_id ??
          product?.subcategory?.id ??
          "",
      ),
      brandId: String(
        product?.brandId ?? product?.brand_id ?? product?.brand?.id ?? "",
      ),
      unitId: String(
        product?.unitId ?? product?.unit_id ?? product?.unit?.id ?? "",
      ),

      costPrice: String(
        product?.costPrice ??
          product?.cost_price ??
          product?.buyPrice ??
          product?.cost ??
          "",
      ),
      sellPrice: String(
        product?.sellPrice ?? product?.sell_price ?? product?.price ?? "",
      ),
      alertQuantity: String(
        product?.alertQuantity ?? product?.alert_quantity ?? prev.alertQuantity,
      ),

      openingStock: "",
      imageFile: null,
    }));
  }, [product]);

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return subcategories.filter(
      (s) => String(s.categoryId) === String(formData.categoryId),
    );
  }, [subcategories, formData.categoryId]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    if (field === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
        subcategoryId: "",
      }));
      return;
    }

    if (field === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: value as File | null }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isAnyLoading =
    categoriesLoading ||
    subcategoriesLoading ||
    brandsLoading ||
    unitsLoading ||
    productLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Missing product id");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Name required");
      return;
    }

    if (!formData.productCode.trim()) {
      toast.error("Product code required");
      return;
    }

    try {
      const payload: any = {
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
        openingStock: parseInt(formData.openingStock || "0", 10) || 0,
      };

      await updateProduct({ id, data: payload }).unwrap();

      toast.success("Product Updated");
      //   navigate(`/products/${id}`);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Something went wrong while updating product.";
      toast.error(msg);
    }
  };

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

  return (
    <DashboardLayout title="Edit Product">
      <div className="space-y-6">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Inventory</p>
              <h1 className="mt-1 text-3xl font-bold text-foreground">
                Edit product
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Update product pricing, categorization, stock alert, and details.
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </section>

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger
            value="products"
            onClick={() => navigate("/products")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            PRODUCTS
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            EDIT PRODUCT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-0">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <PackageCheck className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Product details</h3>
                    <p className="text-sm text-muted-foreground">
                      Review existing data before saving changes.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/products/${id}`)}
                    disabled={!id}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={productLoading || productFetching}
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${
                        productFetching ? "animate-spin" : ""
                      }`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>

              {isAnyLoading && (
                <p className="text-sm text-muted-foreground mb-4">
                  Loading dropdown data...
                </p>
              )}

              {productError ? (
                <div className="rounded-md border p-4 mb-4">
                  <p className="text-sm text-destructive">
                    Failed to load product.
                  </p>
                  <Button
                    className="mt-3"
                    variant="outline"
                    onClick={() => refetch()}
                  >
                    Retry
                  </Button>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-5">
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

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    placeholder="Enter barcode (optional)"
                    value={formData.barcode}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="description">Product Details</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => handleChange("description", value)}
                    placeholder="Enter product details..."
                  />
                </div>

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
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/products")}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-8"
                    disabled={updating || productLoading}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>

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

export default EditProduct;
