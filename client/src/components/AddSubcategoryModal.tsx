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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface AddSubcategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { value: string; label: string }[];
  selectedCategory?: string;
  onSubcategoryAdded?: (subcategory: { name: string; code: string; categoryId: string }) => void;
}

const AddSubcategoryModal = ({
  open,
  onOpenChange,
  categories,
  selectedCategory,
  onSubcategoryAdded,
}: AddSubcategoryModalProps) => {
  const { toast } = useToast();
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryCode, setSubcategoryCode] = useState("");
  const [parentCategory, setParentCategory] = useState(selectedCategory || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subcategoryName.trim()) {
      toast({
        title: "Error",
        description: "Subcategory name is required",
        variant: "destructive",
      });
      return;
    }

    if (!parentCategory) {
      toast({
        title: "Error",
        description: "Please select a parent category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Subcategory Added",
      description: `${subcategoryName} has been added successfully.`,
    });

    onSubcategoryAdded?.({
      name: subcategoryName,
      code: subcategoryCode,
      categoryId: parentCategory,
    });
    
    setSubcategoryName("");
    setSubcategoryCode("");
    setParentCategory(selectedCategory || "");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subcategory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parentCategory">
              Parent Category<span className="text-destructive">*</span>
            </Label>
            <Select value={parentCategory} onValueChange={setParentCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select Parent Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategoryName">
              Subcategory Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="subcategoryName"
              placeholder="Enter Subcategory Name.."
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subcategoryCode">Subcategory Code</Label>
            <Input
              id="subcategoryCode"
              placeholder="Enter Subcategory Code.."
              value={subcategoryCode}
              onChange={(e) => setSubcategoryCode(e.target.value)}
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

export default AddSubcategoryModal;
