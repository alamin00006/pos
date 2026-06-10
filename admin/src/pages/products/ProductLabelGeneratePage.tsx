"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Printer, RefreshCw, Wand2 } from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@/lib/router";
import { useGetProductQuery } from "@/redux/api/productsApi";
import ProductBarcodeSheet, {
  getProductCode,
  getProductPrice,
  MAX_BARCODE_LABELS,
  ProductLabelMode,
  toSafeLabelCount,
} from "./ProductBarcodeSheet";

type ProductLabelGeneratePageProps = {
  mode: ProductLabelMode;
  defaultQuantity: string;
  defaultGeneratedCount: number;
};

export default function ProductLabelGeneratePage({
  mode,
  defaultQuantity,
  defaultGeneratedCount,
}: ProductLabelGeneratePageProps) {
  const params = useParams<{ id: string }>();
  const id = params?.id ? String(params.id) : "";
  const navigate = useNavigate();
  const labelTitle = mode === "barcode" ? "Barcode" : "QR Code";
  const previewId = `${mode}-a4-preview`;

  const [quantity, setQuantity] = useState(defaultQuantity);
  const [generatedCount, setGeneratedCount] = useState(defaultGeneratedCount);

  const {
    data: productRes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductQuery(id, { skip: !id }) as any;

  const product = productRes?.data;
  const productCode = getProductCode(product);
  const price = getProductPrice(product);

  const handleGenerate = () => {
    if (!product) {
      toast.error("Product not loaded yet");
      return;
    }

    const count = toSafeLabelCount(quantity);
    setQuantity(String(count));
    setGeneratedCount(count);
  };

  const handleReset = () => {
    setQuantity(defaultQuantity);
    setGeneratedCount(defaultGeneratedCount);
  };

  const handlePrint = () => {
    const content = document.getElementById(previewId)?.innerHTML;
    if (!content) {
      toast.error(`Generate ${labelTitle.toLowerCase()} labels first`);
      return;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      toast.error(`Please allow popups to print ${labelTitle.toLowerCase()} labels`);
      return;
    }

    // The print window owns its CSS so the A4 sheet prints without the admin UI.
    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>${labelTitle} Labels</title>
          <style>
            @page { size: A4; margin: 12mm; }
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Arial, sans-serif; color: #000; }
            .barcode-sheet {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 5mm;
              align-content: start;
            }
            .product-print-label {
              min-height: 36mm;
              border: 1px dashed #c8c8c8;
              padding: 4mm;
              text-align: center;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .label-shop { font-size: 11px; color: #64748b; }
            .label-name { font-size: 12px; font-weight: 700; color: #334155; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .label-price { font-size: 12px; font-weight: 700; color: #334155; }
            .label-code { font-size: 11px; letter-spacing: 0.24em; color: #64748b; }
            .barcode-svg { display: block; width: 100%; height: 40px; margin: 5px 0; }
            .qr-grid { display: grid; grid-template-columns: repeat(21, 4px); width: 84px; margin: 5px auto; }
            .bg-black { background: #000; }
            .bg-white { background: #fff; }
          </style>
        </head>
        <body>${content}<script>window.onload = () => window.print();</script></body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <DashboardLayout title={`Generate ${labelTitle}`}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-md border bg-card p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Product Details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate and print A4 {labelTitle.toLowerCase()} labels for this product.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/products")}>
              Product List
            </Button>
            <Button variant="outline" onClick={() => navigate(`/products/edit/${id}`)}>
              Edit
            </Button>
          </div>
        </div>

        {error ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-destructive">Failed to load product.</p>
              <Button className="mt-3" variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardContent className="flex min-h-[190px] items-center gap-6 p-6">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                {String(product?.name ?? "P").charAt(0)}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Product #{product?.id ?? "-"}
                </p>
                <h3 className="mt-1 text-xl font-semibold">
                  {isLoading ? "Loading..." : product?.name ?? "Product"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Product Code : {productCode || "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Price : {price.toFixed(2)} Tk
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">Generate {labelTitle}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Input number to print {labelTitle.toLowerCase()}. You can print{" "}
                    <span className="font-semibold text-foreground">
                      Maximum {MAX_BARCODE_LABELS} copies
                    </span>{" "}
                    at a time.
                  </p>
                </div>
                <Button variant="ghost" className="gap-2" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div className="space-y-2">
                  <Label htmlFor="labelQuantity">Number of {labelTitle}</Label>
                  <Input
                    id="labelQuantity"
                    type="number"
                    min={1}
                    max={MAX_BARCODE_LABELS}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
                <Button
                  className="gap-2"
                  onClick={handleGenerate}
                  disabled={isLoading || isFetching || !product}
                >
                  <Wand2 className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-center text-lg font-semibold md:flex-1">
                A4 Size Paper Preview
              </h3>
              <Button
                className="gap-2 md:ml-auto"
                onClick={handlePrint}
                disabled={!generatedCount}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>

            <div className="mx-auto min-h-[520px] max-w-[794px] rounded-lg border bg-white p-7 shadow-sm">
              {generatedCount ? (
                <div id={previewId}>
                  <ProductBarcodeSheet
                    product={product}
                    count={generatedCount}
                    mode={mode}
                  />
                </div>
              ) : (
                <div className="grid min-h-[460px] place-items-center text-sm text-muted-foreground">
                  Enter quantity and click Generate to preview labels.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
