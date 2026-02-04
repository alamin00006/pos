import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface AddBrandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBrandAdded?: (brand: { name: string; code: string }) => void;
}

const AddBrandModal = ({ open, onOpenChange, onBrandAdded }: AddBrandModalProps) => {
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [brandCode, setBrandCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandName.trim()) {
      toast({
        title: "Error",
        description: "Brand name is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Brand Added",
      description: `${brandName} has been added successfully.`,
    });

    onBrandAdded?.({ name: brandName, code: brandCode });
    setBrandName("");
    setBrandCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">
              Brand Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="brandName"
              placeholder="Enter Brand Name.."
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandCode">Brand Code</Label>
            <Input
              id="brandCode"
              placeholder="Enter Brand Code.."
              value={brandCode}
              onChange={(e) => setBrandCode(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBrandModal;
