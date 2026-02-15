import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const AddDamage = () => {
  const [productSearch, setProductSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!productSearch) {
      toast({
        title: "Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Damage record added successfully",
    });
    setProductSearch("");
    setNote("");
  };

  return (
    <DashboardLayout title="Add Damage">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Add Damage</h1>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Add Damage</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search Your Product
              </label>
              <Input
                placeholder="Search Product"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Note
              </label>
              <Textarea
                placeholder=""
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add Damage
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddDamage;
