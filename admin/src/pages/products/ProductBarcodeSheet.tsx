"use client";

type ProductBarcodeSheetProps = {
  product: any;
  count: number;
  mode?: ProductLabelMode;
  className?: string;
};

export type ProductLabelMode = "barcode" | "qr";

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

export const MAX_BARCODE_LABELS = 270;

export const getProductCode = (product: any) =>
  String(product?.productCode ?? product?.product_code ?? product?.code ?? "");

export const getProductPrice = (product: any) =>
  Number(product?.sellPrice ?? product?.sell_price ?? product?.price ?? 0);

export const toSafeLabelCount = (value: string | number) =>
  Math.min(
    MAX_BARCODE_LABELS,
    Math.max(1, parseInt(String(value || "1"), 10) || 1),
  );

export const toCode128Bars = (value: string) => {
  const source = (value || "PRD-000").replace(/[^\x20-\x7f]/g, "");
  const codes = [104, ...source.split("").map((char) => char.charCodeAt(0) - 32)];
  const checksum =
    codes.reduce((total, code, index) => total + code * (index === 0 ? 1 : index), 0) %
    103;
  const sequence = [...codes, checksum, 106];
  let x = 10;

  // Code 128-B stays scannable for alpha-numeric product codes like PRD-009.
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
  const source = value || "product";
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

      const charCode = source.charCodeAt((row * size + col) % source.length);
      return (charCode + row * 3 + col * 5) % 4 === 0;
    }),
  );
};

function ProductBarcodeLabel({
  product,
  mode,
}: {
  product: any;
  mode: ProductLabelMode;
}) {
  const code = getProductCode(product);
  const name = String(product?.name ?? "Product");
  const price = getProductPrice(product);
  const barcode = toCode128Bars(code);
  const qrPattern = buildQrPattern(`${code}-${name}`);

  return (
    <div className="product-print-label border border-dashed border-slate-300 bg-white px-4 py-3 text-center text-black">
      <div className="label-shop text-xs text-slate-500">POS Software</div>
      <div className="label-name truncate text-sm font-semibold text-slate-700">
        {name}
      </div>
      <div className="label-price text-sm font-semibold text-slate-700">
        {price.toFixed(2)} Tk
      </div>
      {mode === "barcode" ? (
        <svg
          className="barcode-svg my-2 h-10 w-full"
          viewBox={`0 0 ${barcode.width} 56`}
          role="img"
          aria-label={`Barcode ${code}`}
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
        <div className="qr-grid mx-auto my-2 grid w-[84px] grid-cols-[repeat(21,4px)]">
          {qrPattern.flatMap((row, rowIndex) =>
            row.map((active, colIndex) => (
              <span
                key={`${rowIndex}-${colIndex}`}
                className={active ? "h-1 w-1 bg-black" : "h-1 w-1 bg-white"}
              />
            )),
          )}
        </div>
      )}
      <div className="label-code text-xs tracking-[0.25em] text-slate-500">
        {code || "-"}
      </div>
    </div>
  );
}

export default function ProductBarcodeSheet({
  product,
  count,
  mode = "barcode",
  className = "",
}: ProductBarcodeSheetProps) {
  const labels = Array.from({ length: toSafeLabelCount(count) }, (_, index) => index);

  return (
    <div className={`barcode-sheet grid grid-cols-3 gap-4 ${className}`}>
      {labels.map((index) => (
        <ProductBarcodeLabel key={index} product={product} mode={mode} />
      ))}
    </div>
  );
}
