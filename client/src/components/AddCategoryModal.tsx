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

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded?: (category: { name: string; code: string }) => void;
}

const AddCategoryModal = ({ open, onOpenChange, onCategoryAdded }: AddCategoryModalProps) => {
  const { toast } = useToast();
  const [categoryName, setCategoryName] = useState("");
  const [categoryCode, setCategoryCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Category Added",
      description: `${categoryName} has been added successfully.`,
    });

    onCategoryAdded?.({ name: categoryName, code: categoryCode });
    setCategoryName("");
    setCategoryCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">
              Category Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="categoryName"
              placeholder="Enter Category Name.."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryCode">Category Code</Label>
            <Input
              id="categoryCode"
              placeholder="Enter Category Code.."
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
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

export default AddCategoryModal;
