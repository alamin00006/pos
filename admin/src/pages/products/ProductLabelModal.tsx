"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";
import toast from "react-hot-toast";

type ProductLabelMode = "barcode" | "qr";

type ProductLabelModalProps = {
  product: any | null;
  mode: ProductLabelMode;
  onOpenChange: (open: boolean) => void;
};

const getProductCode = (product: any) =>
  String(product?.productCode ?? product?.product_code ?? product?.code ?? "");

const CODE_128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213",
  "122312", "132212", "221213", "221312", "231212", "112232", "122132",
  "122231", "113222", "123122", "123221", "223211", "221132", "221231",
  "213212", "223112", "312131", "311222", "321122", "321221", "312212",
  "322112", "322211", "212123", "212321", "232121", "111323", "131123",
  "131321", "112313", "132113", "132311", "211313", "231113", "231311",
  "112133", "112331", "132131", "113123", "113321", "133121", "313121",
  "211331", "231131", "213113", "213311", "213131", "311123", "311321",
  "331121", "312113", "312311", "332111", "314111", "221411", "431111",
  "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114",
  "413111", "241112", "134111", "111242", "121142", "121241", "114212",
  "124112", "124211", "411212", "421112", "421211", "212141", "214121",
  "412121", "111143", "111341", "131141", "114113", "114311", "411113",
  "411311", "113141", "114131", "311141", "411131", "211412", "211214",
  "211232", "2331112",
];

const toCode128Bars = (value: string) => {
  const source = (value || "PRD-000").replace(/[^\x20-\x7f]/g, "");
  const codes = [104, ...source.split("").map((char) => char.charCodeAt(0) - 32)];
  const checksum =
    codes.reduce((total, code, index) => total + code * (index === 0 ? 1 : index), 0) %
    103;
  const sequence = [...codes, checksum, 106];
  let x = 10;

  // Code 128-B is scannable for product codes like PRD-009 and prints cleanly on A4.
  const bars = sequence.flatMap((code) => {
    let black = true;
    return CODE_128_PATTERNS[code].split("").flatMap((widthText) => {
      const width = Number(widthText) * 2;
      const bar = black ? [{ x, width }] : [];
      x += width;
      black = !black;
      return bar;
    });
  });

  return { bars, width: x + 10 };
};

const buildQrPattern = (value: string) => {
  const size = 21;
  const hashSeed = value || "product";
  const finder = (row: number, col: number, startRow: number, startCol: number) =>
    row >= startRow &&
    row < startRow + 7 &&
    col >= startCol &&
    col < startCol + 7 &&
    (row === startRow ||
      row === startRow + 6 ||
      col === startCol ||
      col === startCol + 6 ||
      (row >= startRow + 2 &&
        row <= startRow + 4 &&
        col >= startCol + 2 &&
        col <= startCol + 4));

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => {
      if (
        finder(row, col, 0, 0) ||
        finder(row, col, 0, size - 7) ||
        finder(row, col, size - 7, 0)
      ) {
        return true;
      }
      const charCode = hashSeed.charCodeAt((row * size + col) % hashSeed.length);
      return (charCode + row * 3 + col * 5) % 4 === 0;
    }),
  );
};

export default function ProductLabelModal({
  product,
  mode,
  onOpenChange,
}: ProductLabelModalProps) {
  const [labelCount, setLabelCount] = useState("24");
  const labelCode = getProductCode(product);
  const labelName = String(product?.name ?? "");
  const labelPrice = Number(product?.sellPrice ?? product?.price ?? 0);
  const barcode = toCode128Bars(labelCode);
  const qrPattern = buildQrPattern(`${labelCode}-${labelName}`);
  const copies = Math.min(200, Math.max(1, parseInt(labelCount || "1", 10) || 1));
  const labels = useMemo(
    () => Array.from({ length: copies }, (_, index) => index),
    [copies],
  );

  useEffect(() => {
    if (product) setLabelCount("24");
  }, [product]);

  const renderLabel = (labelClassName = "") => (
    <div
      className={`product-print-label rounded-md border bg-white p-3 text-center text-black ${labelClassName}`}
    >
      <div className="small font-bold">POS Software</div>
      {mode === "barcode" ? (
        <svg
          className="barcode-svg my-1.5 h-10 w-full"
          viewBox={`0 0 ${barcode.width} 56`}
          role="img"
          aria-label={`Barcode ${labelCode}`}
          preserveAspectRatio="none"
        >
          <rect width={barcode.width} height="56" fill="#fff" />
          {barcode.bars.map((bar, index) => (
            <rect
              key={index}
              x={bar.x}
              y="4"
              width={bar.width}
              height="44"
              fill="#000"
              shapeRendering="crispEdges"
            />
          ))}
        </svg>
      ) : (
        <div className="qr-grid mx-auto my-1.5 grid w-[105px] grid-cols-[repeat(21,5px)]">
          {qrPattern.flatMap((row, rowIndex) =>
            row.map((active, colIndex) => (
              <span
                key={`${rowIndex}-${colIndex}`}
                className={
                  active ? "h-[5px] w-[5px] bg-black" : "h-[5px] w-[5px] bg-white"
                }
              />
            )),
          )}
        </div>
      )}
      <div className="small">{labelCode || "-"}</div>
      <div className="name truncate text-xs font-semibold leading-tight">
        {labelName || "Product"}
      </div>
      <div className="price text-xs font-bold leading-tight">
        {labelPrice.toFixed(2)} Tk
      </div>
    </div>
  );

  const handlePrintLabel = () => {
    const content = document.getElementById("product-label-sheet")?.innerHTML;
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=900,height=1100");
    if (!printWindow) {
      toast.error("Please allow popups to print label");
      return;
    }

    // Isolated print document keeps the label clean without printing the full app.
    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Product Label</title>
          <style>
            @page { size: A4; margin: 10mm; }
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Arial, sans-serif; color: #000; }
            .label-sheet {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 6mm;
              align-content: start;
            }
            .product-print-label {
              width: 100%;
              min-height: 31mm;
              border: 1px solid #111;
              border-radius: 3px;
              padding: 3mm;
              text-align: center;
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .barcode-svg { display: block; width: 100%; height: 40px; margin: 4px 0; }
            .qr-grid { display: grid; grid-template-columns: repeat(21, 5px); width: 105px; margin: 4px auto; }
            .small { font-size: 10px; line-height: 1.15; }
            .name { font-size: 11px; line-height: 1.15; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .price { font-size: 12px; line-height: 1.15; font-weight: 700; }
            .bg-black { background: #000; }
            .bg-white { background: #fff; }
            .bg-transparent { background: transparent; }
            button { display: none; }
          </style>
        </head>
        <body>${content}<script>window.onload = () => window.print();</script></body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "barcode" ? "Barcode" : "QR Code"} Label</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-[180px_1fr]">
          <div className="space-y-2">
            <Label htmlFor="labelCount">Label Quantity</Label>
            <Input
              id="labelCount"
              type="number"
              min={1}
              max={200}
              value={labelCount}
              onChange={(event) => setLabelCount(event.target.value)}
              placeholder="24"
            />
          </div>

          <div className="rounded-md border bg-muted/20 p-3">
            <div
              id="product-label-sheet"
              className="label-sheet grid max-h-[520px] grid-cols-2 gap-3 overflow-auto bg-white p-3 md:grid-cols-3"
            >
              {labels.map((index) => (
                <div key={index}>{renderLabel()}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrintLabel}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
