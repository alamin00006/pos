"use client";

import ProductLabelGeneratePage from "@/pages/products/ProductLabelGeneratePage";

export default function ProductBarcodePage() {
  return (
    <ProductLabelGeneratePage
      mode="barcode"
      defaultQuantity="10"
      defaultGeneratedCount={0}
    />
  );
}
