import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AddUnit = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    relatedTo: "",
    relatedSign: "",
    relatedBy: "",
  });

  const existingUnits = ["pc", "gm", "ml"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter unit name",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Unit added successfully!",
    });
    setFormData({ name: "", relatedTo: "", relatedSign: "", relatedBy: "" });
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
              <div className="space-y-2">
                <Label htmlFor="name">Unit Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Dozen, Kg, Litre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedTo">Related To</Label>
                <Select
                  value={formData.relatedTo}
                  onValueChange={(value) => setFormData({ ...formData, relatedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select base unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {existingUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedSign">Related Sign</Label>
                <Select
                  value={formData.relatedSign}
                  onValueChange={(value) => setFormData({ ...formData, relatedSign: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="*">* (Multiply)</SelectItem>
                    <SelectItem value="/">/  (Divide)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="relatedBy">Related By</Label>
                <Input
                  id="relatedBy"
                  type="number"
                  placeholder="e.g., 12, 1000"
                  value={formData.relatedBy}
                  onChange={(e) => setFormData({ ...formData, relatedBy: e.target.value })}
                />
              </div>
            </div>

            {formData.relatedTo && formData.relatedTo !== "none" && formData.relatedSign && formData.relatedBy && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Result: <span className="font-medium text-foreground">
                    {formData.name || "Unit"} = 1 {formData.relatedTo} {formData.relatedSign} {formData.relatedBy}
                  </span>
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Save Unit
              </Button>
              <Button type="button" variant="outline" onClick={() => setFormData({ name: "", relatedTo: "", relatedSign: "", relatedBy: "" })}>
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
