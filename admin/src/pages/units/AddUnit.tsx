"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import toast from "react-hot-toast";

import { useGetUnitsQuery, useCreateUnitMutation } from "@/redux/api/unitsApi";
import type { Unit } from "@/types/unit";

type FormState = {
  name: string;
  shortName: string;
  relatedToId: string; // ✅ store id
  sign: "*" | "/" | "";
  factor: string; // keep as string for input
};

const AddUnit = () => {
  const navigate = useNavigate();

  const listQuery = useMemo(
    () => ({
      page: 1,
      limit: 500,
      search: "",
      sortBy: "name",
      sortOrder: "asc" as const,
    }),
    [],
  );

  const { data: unitsRes, isLoading: unitsLoading } =
    useGetUnitsQuery(listQuery);

  // if your API is ApiResponse<PaginatedResponse<Unit>>
  const existingUnits: Unit[] = unitsRes?.data?.data ?? unitsRes?.data ?? [];

  const [createUnit, { isLoading: creating }] = useCreateUnitMutation();

  const [formData, setFormData] = useState<FormState>({
    name: "",
    shortName: "",
    relatedToId: "none",
    sign: "*",
    factor: "",
  });

  const reset = () =>
    setFormData({
      name: "",
      shortName: "",
      relatedToId: "none",
      sign: "*",
      factor: "",
    });

  const hasConversion = formData.relatedToId && formData.relatedToId !== "none";

  const showResult = hasConversion && formData.factor;

  const relatedToUnit = existingUnits.find(
    (u) => u.id === formData.relatedToId,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    const shortName = formData.shortName.trim();

    if (!name) {
      toast.error("Please enter unit name");
      return;
    }

    // ✅ conversion validation
    if (hasConversion) {
      if (!formData.sign) {
        toast.error("Please select related sign");
        return;
      }
      if (!formData.factor || Number(formData.factor) <= 0) {
        toast.error("Please enter valid factor (Related By)");
        return;
      }
    }

    try {
      const payload: any = {
        name,
        ...(shortName ? { shortName } : {}),
      };

      // ✅ send conversion only if selected
      if (hasConversion) {
        payload.relatedToId = formData.relatedToId;
        payload.sign = formData.sign || "*";
        payload.factor = formData.factor; // backend Prisma Decimal accepts string
      }

      await createUnit(payload).unwrap();

      toast.success("Unit added successfully!");
      reset();
      navigate("/units");
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to add unit.";
      toast.error(msg);
    }
  };

  return (
    <DashboardLayout title="Add Unit">
      <Card>
        <CardHeader>
          <CardTitle>Add New Unit</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Unit Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Unit Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Dozen, Kg, Litre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </div>

              {/* Short Name */}
              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name (Optional)</Label>
                <Input
                  id="shortName"
                  placeholder="e.g., pc, kg, L"
                  value={formData.shortName}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, shortName: e.target.value }))
                  }
                />
              </div>

              {/* Related To */}
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related To (Optional)</Label>
                <Select
                  value={formData.relatedToId}
                  onValueChange={(value) =>
                    setFormData((p) => ({
                      ...p,
                      relatedToId: value,
                      // reset factor if set to none
                      ...(value === "none" ? { factor: "" } : {}),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        unitsLoading ? "Loading..." : "Select base unit"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {existingUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.shortName ? `${u.name} (${u.shortName})` : u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Related Sign */}
              <div className="space-y-2">
                <Label htmlFor="sign">Related Sign</Label>
                <Select
                  value={formData.sign}
                  onValueChange={(value) =>
                    setFormData((p) => ({ ...p, sign: value as any }))
                  }
                  disabled={!hasConversion}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">* (Multiply)</SelectItem>
                    <SelectItem value="/">/ (Divide)</SelectItem>
                  </SelectContent>
                </Select>
                {!hasConversion ? (
                  <p className="text-xs text-muted-foreground">
                    Select “Related To” first
                  </p>
                ) : null}
              </div>

              {/* Factor */}
              <div className="space-y-2">
                <Label htmlFor="factor">Related By (Factor)</Label>
                <Input
                  id="factor"
                  type="number"
                  min={0}
                  placeholder="e.g., 12, 1000"
                  value={formData.factor}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, factor: e.target.value }))
                  }
                  disabled={!hasConversion}
                />
              </div>
            </div>

            {/* Result preview */}
            {showResult && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Result:{" "}
                  <span className="font-medium text-foreground">
                    {formData.name || "Unit"} = 1{" "}
                    {relatedToUnit?.shortName ?? relatedToUnit?.name ?? "base"}{" "}
                    {formData.sign} {formData.factor}
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={creating}
              >
                {creating ? "Saving..." : "Save Unit"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={reset}
                disabled={creating}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AddUnit;
