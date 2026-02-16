"use client";

import React, { useMemo } from "react";
import { useNavigate } from "@/lib/router";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { X } from "lucide-react";

import { useGetProductQuery } from "@/redux/api/productsApi";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
};

function text(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function money(v: any) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "";
  return n.toFixed(2);
}

function resolveImage(product: any) {
  return (
    product?.image ||
    product?.imageUrl ||
    product?.thumbnail ||
    product?.photo ||
    ""
  );
}

export default function ProductDetailsModal({
  open,
  onOpenChange,
  productId,
}: Props) {
  const navigate = useNavigate();

  const {
    data: res,
    isLoading,
    isFetching,
    error,
  } = useGetProductQuery(productId as string, {
    skip: !open || !productId,
  }) as any;

  const product = res?.data;

  const vm = useMemo(() => {
    const p = product;

    return {
      title: text(p?.name) || "Product",
      code: text(p?.productCode || p?.product_code || p?.code),
      category: text(p?.category?.name || p?.category),
      brand: text(p?.brand?.name || p?.brand),
      price: money(p?.sellPrice ?? p?.price),
      cost: money(p?.costPrice ?? p?.cost),
      stock: text(p?.stock ?? ""),
      details: text(p?.description ?? p?.details ?? ""),
      image: resolveImage(p),
    };
  }, [product]);

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="grid grid-cols-2 border-b last:border-b-0">
      <div className="px-5 py-4 text-sm text-muted-foreground">{label}</div>
      <div className="px-5 py-4 text-sm text-foreground">{value}</div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0">
        {/* Header like screenshot (title left + X right) */}
        <div className="flex items-center justify-between px-6 py-4">
          <DialogHeader className="p-0 space-y-0">
            <DialogTitle className="text-lg font-medium">
              {isLoading ? "Loading..." : vm.title}
            </DialogTitle>
          </DialogHeader>
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
                <div className="w-[180px] h-[180px] border bg-background flex items-center justify-center overflow-hidden">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : vm.image ? (
                    // no next/image to keep it simple inside modal
                    <img
                      src={vm.image}
                      alt={vm.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {/* Right table */}
              <div className="border rounded-sm overflow-hidden">
                {isLoading ? (
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-2/5" />
                  </div>
                ) : (
                  <>
                    <Row label="Code" value={vm.code || "-"} />
                    <Row label="Category" value={vm.category || "-"} />
                    <Row label="Brand" value={vm.brand || "-"} />
                    <Row label="Price" value={vm.price ? `${vm.price}` : "-"} />
                    <Row label="Cost" value={vm.cost ? `${vm.cost}` : "-"} />
                    <Row label="Stock" value={vm.stock || "0"} />
                    <Row
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

        {isFetching ? (
          <div className="absolute right-6 top-5 text-xs text-muted-foreground">
            Loading...
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
