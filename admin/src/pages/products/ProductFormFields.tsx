"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";
import { Plus } from "lucide-react";
import ProductUnitFields from "./ProductUnitFields";

export type ProductFormState = {
  name: string;
  productCode: string;
  description: string;
  categoryId: string;
  brandId: string;
  unitId: string;
  subUnitValue: string;
  costPrice: string;
  sellPrice: string;
  alertQuantity: string;
  openingStockMain: string;
  openingStockSub: string;
  imageFile: File | null;
};

type SelectOption = { id: string; name: string };

type ProductFormFieldsProps = {
  formData: ProductFormState;
  categories: SelectOption[];
  brands: SelectOption[];
  units: any[];
  showOpeningStock?: boolean;
  onChange: (field: keyof ProductFormState, value: any) => void;
  onAddCategory: () => void;
  onAddBrand: () => void;
};

export default function ProductFormFields({
  formData,
  categories,
  brands,
  units,
  showOpeningStock = false,
  onChange,
  onAddCategory,
  onAddBrand,
}: ProductFormFieldsProps) {
  // Shared by Add and Edit pages so product field order and behavior stay identical.
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">
          Product Name<span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Enter Product Name.."
          value={formData.name}
          onChange={(event) => onChange("name", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productCode">Product Code</Label>
        <Input
          id="productCode"
          placeholder="Leave blank for auto code, e.g. PRD-001"
          value={formData.productCode}
          onChange={(event) => onChange("productCode", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoryId">
          Category<span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          <Select
            value={formData.categoryId}
            onValueChange={(value) => onChange("categoryId", value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10"
            onClick={onAddCategory}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Category
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="brandId">Brand</Label>
        <div className="flex gap-3">
          <Select
            value={formData.brandId}
            onValueChange={(value) => onChange("brandId", value)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10"
            onClick={onAddBrand}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Brand
          </Button>
        </div>
      </div>

      <ProductUnitFields
        units={units}
        unitId={formData.unitId}
        onUnitChange={(value) => onChange("unitId", value)}
        subUnitValue={formData.subUnitValue}
        onSubUnitChange={(value) => onChange("subUnitValue", value)}
        showOpeningStock={showOpeningStock}
        openingStockMain={formData.openingStockMain}
        openingStockSub={formData.openingStockSub}
        onOpeningStockMainChange={(value) => onChange("openingStockMain", value)}
        onOpeningStockSubChange={(value) => onChange("openingStockSub", value)}
      />

      <div className="space-y-2">
        <Label htmlFor="sellPrice">
          Sell Price<span className="text-destructive">*</span>
        </Label>
        <Input
          id="sellPrice"
          type="number"
          min={0}
          step="0.01"
          placeholder="Enter sell price.."
          value={formData.sellPrice}
          onChange={(event) => onChange("sellPrice", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="costPrice">
          Cost Price<span className="text-destructive">*</span>
        </Label>
        <Input
          id="costPrice"
          type="number"
          min={0}
          step="0.01"
          placeholder="Enter cost price.."
          value={formData.costPrice}
          onChange={(event) => onChange("costPrice", event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alertQuantity">Alert Quantity</Label>
        <Input
          id="alertQuantity"
          type="number"
          min={0}
          placeholder="10"
          value={formData.alertQuantity}
          onChange={(event) => onChange("alertQuantity", event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Product Details</Label>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => onChange("description", value)}
          placeholder="Enter product details..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageFile">Product Image</Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={(event) =>
            onChange("imageFile", event.target.files?.[0] || null)
          }
          className="cursor-pointer"
        />
      </div>
    </>
  );
}
