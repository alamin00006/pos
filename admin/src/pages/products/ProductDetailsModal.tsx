"use client";

import React, { useMemo, useCallback, memo } from "react";
import { useNavigate } from "@/lib/router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { X, Package } from "lucide-react";

import { useGetProductQuery } from "@/redux/api/productsApi";

// ==================== Types ====================
type Product = {
  id?: string;
  name?: string;
  productCode?: string;
  product_code?: string;
  code?: string;
  category?: { name?: string } | string;
  brand?: { name?: string } | string;
  sellPrice?: number;
  price?: number;
  costPrice?: number;
  cost?: number;
  stock?: number | string;
  description?: string;
  details?: string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  photo?: string;
};

type ProductDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
};

// ==================== Utility Functions ====================
const formatCurrency = (value: unknown): string => {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num === 0) return "";
  return num.toFixed(2);
};

const formatText = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  return String(value);
};

const resolveImage = (product: Product | undefined): string => {
  if (!product) return "";
  return (
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    product.photo ||
    ""
  );
};

const getNestedValue = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "object" && "name" in value) {
    return formatText(value.name);
  }
  return formatText(value);
};

// ==================== Components ====================
const TableRow = memo(
  ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div
      className="grid grid-cols-2 border-b last:border-b-0"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div className="px-5 py-4 text-sm text-muted-foreground">{label}</div>
      <div className="px-5 py-4 text-sm text-foreground">{value}</div>
    </div>
  ),
);

TableRow.displayName = "TableRow";

// ==================== Main Component ====================
export default function ProductDetailsModal({
  open,
  onOpenChange,
  productId,
}: ProductDetailsModalProps) {
  const navigate = useNavigate();

  const {
    data: res,
    isLoading,
    isFetching,
    error,
  } = useGetProductQuery(productId as string, {
    skip: !open || !productId,
    refetchOnMountOrArgChange: false,
  });

  const product = res?.data as Product | undefined;

  // Memoized view model
  const vm = useMemo(() => {
    if (!product) {
      return {
        title: "Product",
        code: "",
        category: "",
        brand: "",
        price: "",
        cost: "",
        stock: "",
        details: "",
        image: "",
      };
    }

    const price = Number(product.sellPrice ?? product.price ?? 0);
    const cost = Number(product.costPrice ?? product.cost ?? 0);

    return {
      title: formatText(product.name) || "Product",
      code: formatText(
        product.productCode || product.product_code || product.code,
      ),
      category: getNestedValue(product.category),
      brand: getNestedValue(product.brand),
      price: price ? formatCurrency(price) : "",
      cost: cost ? formatCurrency(cost) : "",
      stock: formatText(product.stock ?? ""),
      details: formatText(product.description ?? product.details),
      image: resolveImage(product),
    };
  }, [product]);

  // Memoized callbacks
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange(newOpen);
    },
    [onOpenChange],
  );

  const handleEdit = useCallback(() => {
    if (productId) {
      onOpenChange(false);
      navigate(`/products/${productId}/edit`);
    }
  }, [productId, navigate, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <DialogHeader className="p-0 space-y-0">
            <DialogTitle className="text-lg font-medium">
              {isLoading ? "Loading..." : vm.title}
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {/* Body */}
        <div className="px-6 py-6">
          {error ? (
            <div className="border rounded-md p-4 text-sm text-destructive">
              Failed to load product.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
              {/* Left image box */}
              <div className="flex items-start justify-center">
                <div className="w-[180px] h-[180px] border bg-background flex items-center justify-center overflow-hidden rounded-md">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : vm.image ? (
                    <img
                      src={vm.image}
                      alt={vm.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {/* Right table with lighter borders */}
              <div
                className="border rounded-md overflow-hidden"
                style={{ borderColor: "#e5e7eb" }}
              >
                {isLoading ? (
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-2/5" />
                  </div>
                ) : (
                  <>
                    <TableRow label="Code" value={vm.code || "-"} />
                    <TableRow label="Category" value={vm.category || "-"} />
                    <TableRow label="Brand" value={vm.brand || "-"} />
                    <TableRow label="Price" value={vm.price || "-"} />
                    <TableRow label="Cost" value={vm.cost || "-"} />
                    <TableRow label="Stock" value={vm.stock || "0"} />
                    <TableRow
                      label="Details"
                      value={
                        vm.details ? (
                          <div className="whitespace-pre-wrap leading-6">
                            {vm.details}
                          </div>
                        ) : (
                          "-"
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {isFetching && (
          <div className="absolute right-6 top-5 text-xs text-muted-foreground">
            Loading...
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
