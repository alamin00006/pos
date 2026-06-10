"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PackageCheck, Save, ArrowLeft, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";

import AddCategoryModal from "@/components/AddCategoryModal";
import AddBrandModal from "@/components/AddBrandModal";
import ProductFormFields, {
  ProductFormState,
} from "@/pages/products/ProductFormFields";

import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useGetBrandsQuery } from "@/redux/api/brandsApi";
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

const initialProductFormData: ProductFormState = {
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
  imageFile: null,
};

const EditProduct = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ? String(params.id) : "";

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

  const categories: SelectOption[] = (categoriesRes?.data ?? []) as any;
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

  const [formData, setFormData] =
    useState<ProductFormState>(initialProductFormData);

  // Hydrate form once product loads
  useEffect(() => {
    if (!product) return;

    setFormData((prev) => ({
      ...prev,
      name: String(product?.name ?? ""),
      productCode: String(
        product?.productCode ?? product?.product_code ?? product?.code ?? "",
      ),
      description: String(product?.description ?? product?.details ?? ""),

      categoryId: String(
        product?.categoryId ??
          product?.category_id ??
          product?.category?.id ??
          "",
      ),
      brandId: String(
        product?.brandId ?? product?.brand_id ?? product?.brand?.id ?? "",
      ),
      unitId: String(
        product?.unitId ?? product?.unit_id ?? product?.unit?.id ?? "",
      ),
      subUnitValue: "main",

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

      openingStockMain: "",
      openingStockSub: "",
      imageFile: null,
    }));
  }, [product]);

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

  const isAnyLoading =
    categoriesLoading ||
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

    try {
      const payload: any = {
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
    }));
  };


  const handleBrandAdded = (brand: { id: string; name: string }) => {
    setFormData((prev) => ({ ...prev, brandId: brand.id }));
  };

  return (
    <DashboardLayout title="Edit Product">
      <div className="space-y-6">
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
                <ProductFormFields
                  formData={formData}
                  categories={categories}
                  brands={brands}
                  units={units}
                  onChange={handleChange}
                  onAddCategory={() => setShowCategoryModal(true)}
                  onAddBrand={() => setShowBrandModal(true)}
                />

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

      <AddBrandModal
        open={showBrandModal}
        onOpenChange={setShowBrandModal}
        onBrandAdded={handleBrandAdded as any}
      />
    </DashboardLayout>
  );
};

export default EditProduct;
