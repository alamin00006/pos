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
import { useToast } from "@/hooks/use-toast";

import { useGetUnitsQuery, useCreateUnitMutation } from "@/redux/api/unitsApi";
import type { Unit } from "@/types/unit";

const units = ["pc", "Dozen", "gm", "kg", "ml", "Litre", "k1", "kilo"];
const AddUnit = () => {
  const { toast } = useToast();
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
  const existingUnits: Unit[] = unitsRes?.data ?? [];

  const [createUnit, { isLoading: creating }] = useCreateUnitMutation();

  const [formData, setFormData] = useState({
    name: "",
    relatedTo: "",
    relatedSign: "",
    relatedBy: "",
  });

  const reset = () =>
    setFormData({
      name: "",
      relatedTo: "",
      relatedSign: "",
      relatedBy: "",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter unit name",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
      };

      await createUnit(payload as any).unwrap();

      toast({
        title: "Success",
        description: "Unit added successfully!",
      });

      reset();
      navigate("/units");
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Failed to add unit.";
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const showResult =
    formData.relatedTo &&
    formData.relatedTo !== "none" &&
    formData.relatedSign &&
    formData.relatedBy;

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
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Short Name (backend supported) */}
              {/* <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  placeholder="e.g., pc, kg, L"
                  value={formData.shortName}
                  onChange={(e) =>
                    setFormData({ ...formData, shortName: e.target.value })
                  }
                />
              </div> */}

              {/* Related To (UI-only unless you add conversion schema) */}
              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related To (Optional)</Label>
                <Select
                  value={formData.relatedTo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relatedTo: value })
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
                      <SelectItem key={u.id} value={u.name}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Related Sign */}
              <div className="space-y-2">
                <Label htmlFor="relatedSign">Related Sign (Optional)</Label>
                <Select
                  value={formData.relatedSign}
                  onValueChange={(value) =>
                    setFormData({ ...formData, relatedSign: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">* (Multiply)</SelectItem>
                    {/* <SelectItem value="/">/ (Divide)</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* Related By */}
              <div className="space-y-2">
                <Label htmlFor="relatedBy">Related By (Optional)</Label>
                <Input
                  id="relatedBy"
                  type="number"
                  min={0}
                  placeholder="e.g., 12, 1000"
                  value={formData.relatedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, relatedBy: e.target.value })
                  }
                />
              </div>
            </div>

            {/* UI-only Result preview */}
            {showResult && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Result:{" "}
                  <span className="font-medium text-foreground">
                    {formData.name || "Unit"} = 1 {formData.relatedTo}{" "}
                    {formData.relatedSign} {formData.relatedBy}
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
