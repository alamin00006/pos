"use client";

import React, { useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus, Save } from "lucide-react";

import AddCategoryModal from "@/components/AddCategoryModal";
import AddBrandModal from "@/components/AddBrandModal";
import ProductFormFields, { ProductFormState } from "./ProductFormFields";

import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";

import { useCreateProductMutation } from "@/redux/api/productsApi";
import { useGetUnitsQuery } from "@/redux/api/unitsApi";
import { toast } from "react-hot-toast";

type SelectOption = { id: string; name: string };

const toNum = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const initialProductFormData = {
  name: "",
  productCode: "",
  description: "",

  categoryId: "",
  brandId: "",
  unitId: "",
  subUnitValue: "main",

  costPrice: "",
  sellPrice: "",
  alertQuantity: "10",

  openingStockMain: "",
  openingStockSub: "",

  imageFile: null as File | null,
} satisfies ProductFormState;

const AddProduct = () => {
  const navigate = useNavigate();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const { data: categoriesRes, isLoading: categoriesLoading } =
    useGetCategoriesQuery({ page: 1, limit: 500 });

  const { data: brandsRes, isLoading: brandsLoading } = useGetBrandsQuery({
    page: 1,
    limit: 500,
  });

  const { data: unitsRes, isLoading: unitsLoading } = useGetUnitsQuery({
    page: 1,
    limit: 500,
  });

  const categories: SelectOption[] = categoriesRes?.data ?? ([] as any);
  const brands: SelectOption[] = brandsRes?.data ?? [];
  const units: any[] = unitsRes?.data ?? ([] as any);

  const [createProduct, { isLoading: creating }] = useCreateProductMutation();

  const [formData, setFormData] =
    useState<ProductFormState>(initialProductFormData);
  const selectedUnit = units.find((unit) => unit.id === formData.unitId);
  const subUnitFactor = selectedUnit?.conversion?.factor
    ? Number(selectedUnit.conversion.factor)
    : 0;
  const shouldUseSubUnit =
    formData.subUnitValue === "related" && subUnitFactor > 0;

  const handleChange = (field: keyof typeof formData, value: any) => {
    if (field === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: value,
      }));
      return;
    }

    if (field === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: value as File | null }));
      return;
    }

    if (field === "unitId") {
      setFormData((prev) => ({
        ...prev,
        unitId: value,
        subUnitValue: "main",
        openingStockSub: "",
      }));
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
      toast.error("Name required");
      return;
    }
    // if (!formData.productCode.trim()) {
    //   toast({
    //     title: "Product code required",
    //     description: "Product code দিন।",
    //   });
    //   return;
    // }

    try {
      // ✅ Optional: upload image first -> get url
      // let imageUrl: string | undefined = undefined;
      // if (formData.imageFile) {
      //   const fd = new FormData();
      //   fd.append("file", formData.imageFile);
      //   const uploadRes = await uploadFile(fd).unwrap(); // ApiResponse<{ url: string }>
      //   imageUrl = uploadRes.data.url;
      // }

      // Only convert opening stock when the user explicitly selects a sub unit.
      const openingStock =
        shouldUseSubUnit
          ? toNum(formData.openingStockMain) * subUnitFactor +
            toNum(formData.openingStockSub)
          : toNum(formData.openingStockMain);

      const payload = {
        name: formData.name.trim(),
        productCode: formData.productCode.trim() || undefined,
        description: formData.description || undefined,

        costPrice: toNum(formData.costPrice),
        sellPrice: toNum(formData.sellPrice),
        alertQuantity: Math.max(
          0,
          parseInt(formData.alertQuantity || "10", 10) || 10,
        ),

        categoryId: formData.categoryId || undefined,
        brandId: formData.brandId || undefined,
        unitId: formData.unitId || undefined,
        openingStock: Math.max(0, Math.floor(openingStock)),
      };

      await createProduct(payload as any).unwrap();

      // ✅ Optional: opening stock -> stock ledger entry
      // const openingQty = parseInt(formData.openingStock || "0", 10) || 0;
      // if (openingQty > 0) {
      //   await createOpeningStock({
      //     productId: created.data.id,
      //     quantity: openingQty,
      //     note: "Opening stock",
      //   }).unwrap();
      // }
      toast.success("Product Added");
      setFormData(initialProductFormData);

      // navigate("/products");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        "Something went wrong while creating product.";
      toast.error(msg);
    }
  };

  // -----------------------------
  // ✅ Modal callbacks (আপনার modals যেভাবে return দেয় সেভাবে adjust)
  // -----------------------------
  const handleCategoryAdded = (category: { id: string; name: string }) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: category.id,
    }));
  };

  const handleBrandAdded = (brand: { id: string; name: string }) => {
    setFormData((prev) => ({ ...prev, brandId: brand.id }));
  };

  const isAnyLoading =
    categoriesLoading || brandsLoading || unitsLoading;

  return (
    <DashboardLayout title="New Product">
      <div className="space-y-6">
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
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <PackagePlus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Product details</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill the required information carefully before saving.
                  </p>
                </div>
              </div>

              {isAnyLoading && (
                <p className="text-sm text-muted-foreground mb-4">
                  Loading dropdown data...
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <ProductFormFields
                  formData={formData}
                  categories={categories}
                  brands={brands}
                  units={units}
                  showOpeningStock
                  onChange={handleChange}
                  onAddCategory={() => setShowCategoryModal(true)}
                  onAddBrand={() => setShowBrandModal(true)}
                />

                {/* Save */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/products")}>
                    Cancel
                  </Button>
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
      </div>

      {/* Modals */}
      <AddCategoryModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        onCategoryAdded={handleCategoryAdded as any}
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
