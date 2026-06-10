"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductUnitFieldsProps = {
  units: any[];
  unitId: string;
  onUnitChange: (value: string) => void;
  subUnitValue?: string;
  onSubUnitChange?: (value: string) => void;
  openingStockMain?: string;
  openingStockSub?: string;
  onOpeningStockMainChange?: (value: string) => void;
  onOpeningStockSubChange?: (value: string) => void;
  showOpeningStock?: boolean;
};

export default function ProductUnitFields({
  units,
  unitId,
  onUnitChange,
  subUnitValue = "main",
  onSubUnitChange,
  openingStockMain = "",
  openingStockSub = "",
  onOpeningStockMainChange,
  onOpeningStockSubChange,
  showOpeningStock = false,
}: ProductUnitFieldsProps) {
  const selectedUnit = units.find((unit) => unit.id === unitId);
  const mainUnitName = selectedUnit?.shortName || selectedUnit?.name || "";
  const subUnitName =
    selectedUnit?.conversion?.relatedTo?.shortName ||
    selectedUnit?.conversion?.relatedTo?.name ||
    "";
  const subUnitFactor = selectedUnit?.conversion?.factor
    ? String(selectedUnit.conversion.factor)
    : "";
  const isSubUnitSelected = Boolean(subUnitName && subUnitValue === "related");

  // Keeps product stock entry aligned with the conversion defined in Unit setup.
  const subUnitLabel = subUnitName
    ? `1 ${selectedUnit?.name || "main unit"} = ${subUnitFactor} ${subUnitName}`
    : "";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="unitId">Main Unit</Label>
        <Select value={unitId} onValueChange={onUnitChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            {units.map((unit) => (
              <SelectItem key={unit.id} value={unit.id}>
                {unit.shortName ? `${unit.name} (${unit.shortName})` : unit.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subUnit">Sub Unit</Label>
        <Select
          value={subUnitValue}
          onValueChange={onSubUnitChange}
          disabled={!unitId}
        >
          <SelectTrigger id="subUnit">
            <SelectValue placeholder="Select Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Select Unit</SelectItem>
            {subUnitName && (
              <SelectItem value="related">{subUnitName}</SelectItem>
            )}
          </SelectContent>
        </Select>
        {isSubUnitSelected && subUnitLabel && (
          <p className="text-xs text-muted-foreground">{subUnitLabel}</p>
        )}
      </div>

      {showOpeningStock && (
        <div className="space-y-2">
          <Label htmlFor="openingStockMain">Opening Stock</Label>
          <div className={isSubUnitSelected ? "grid gap-2 md:grid-cols-2" : ""}>
            <Input
              id="openingStockMain"
              type="number"
              min={0}
              placeholder={mainUnitName || "Main unit"}
              value={openingStockMain}
              onChange={(event) =>
                onOpeningStockMainChange?.(event.target.value)
              }
            />
            {isSubUnitSelected && (
              <Input
                id="openingStockSub"
                type="number"
                min={0}
                placeholder={subUnitName}
                value={openingStockSub}
                onChange={(event) =>
                  onOpeningStockSubChange?.(event.target.value)
                }
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
