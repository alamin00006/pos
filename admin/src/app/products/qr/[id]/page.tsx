"use client";

import ProductLabelGeneratePage from "@/pages/products/ProductLabelGeneratePage";

export default function ProductQrPage() {
  return (
    <ProductLabelGeneratePage
      mode="qr"
      defaultQuantity="1"
      defaultGeneratedCount={1}
    />
  );
}
