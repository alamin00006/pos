"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Plus } from "lucide-react";
import AddCategoryModal from "@/components/AddCategoryModal";
import AddSubcategoryModal from "@/components/AddSubcategoryModal";
import AddBrandModal from "@/components/AddBrandModal";
import RichTextEditor from "@/components/RichTextEditor";

const AddProduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const [categories, setCategories] = useState([
    { value: "grocery", label: "Grocery" },
    { value: "dairy", label: "Dairy" },
    { value: "bakery", label: "Bakery" },
    { value: "snacks", label: "Snacks" },
    { value: "beverages", label: "Beverages" },
    { value: "household", label: "Household" },
  ]);

  const [subcategories, setSubcategories] = useState([
    { value: "rice", label: "Rice", categoryId: "grocery" },
    { value: "flour", label: "Flour", categoryId: "grocery" },
    { value: "oil", label: "Cooking Oil", categoryId: "grocery" },
    { value: "milk", label: "Milk", categoryId: "dairy" },
    { value: "cheese", label: "Cheese", categoryId: "dairy" },
    { value: "bread", label: "Bread", categoryId: "bakery" },
    { value: "cookies", label: "Cookies", categoryId: "snacks" },
    { value: "chips", label: "Chips", categoryId: "snacks" },
    { value: "juice", label: "Juice", categoryId: "beverages" },
    { value: "soda", label: "Soda", categoryId: "beverages" },
  ]);

  const [brands, setBrands] = useState([
    { value: "brand1", label: "Brand 1" },
    { value: "brand2", label: "Brand 2" },
    { value: "brand3", label: "Brand 3" },
  ]);

  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    category: "",
    subcategory: "",
    brand: "",
    mainUnit: "",
    subUnit: "",
    openingStock: "",
    salePrice: "",
    purchaseCost: "",
    productDetails: "",
    productImage: null as File | null,
  });

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.categoryId === formData.category
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Product Added",
      description: `${formData.productName} has been added successfully.`,
    });
    navigate("/products");
  };

  const handleChange = (field: string, value: string | File | null) => {
    if (field === "category" && typeof value === "string") {
      setFormData((prev) => ({ ...prev, category: value, subcategory: "" }));
    } else if (field === "productImage") {
      setFormData((prev) => ({ ...prev, productImage: value as File | null }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as string }));
    }
  };

  const handleCategoryAdded = (category: { name: string; code: string }) => {
    const newCategory = {
      value: category.code || category.name.toLowerCase().replace(/\s+/g, "-"),
      label: category.name,
    };
    setCategories((prev) => [...prev, newCategory]);
    setFormData((prev) => ({ ...prev, category: newCategory.value, subcategory: "" }));
  };

  const handleSubcategoryAdded = (subcategory: { name: string; code: string; categoryId: string }) => {
    const newSubcategory = {
      value: subcategory.code || subcategory.name.toLowerCase().replace(/\s+/g, "-"),
      label: subcategory.name,
      categoryId: subcategory.categoryId,
    };
    setSubcategories((prev) => [...prev, newSubcategory]);
    setFormData((prev) => ({ ...prev, subcategory: newSubcategory.value }));
  };

  const handleBrandAdded = (brand: { name: string; code: string }) => {
    const newBrand = {
      value: brand.code || brand.name.toLowerCase().replace(/\s+/g, "-"),
      label: brand.name,
    };
    setBrands((prev) => [...prev, newBrand]);
    setFormData((prev) => ({ ...prev, brand: newBrand.value }));
  };

  return (
    <DashboardLayout title="New Product">
      <Tabs defaultValue="add" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger
            value="products"
            onClick={() => navigate("/products")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            PRODUCTS
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            + ADD PRODUCT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">New Product</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="productName">
                    Product Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="productName"
                    placeholder="Enter Product Name.."
                    value={formData.productName}
                    onChange={(e) => handleChange("productName", e.target.value)}
                    required
                  />
                </div>

                {/* Product Code */}
                <div className="space-y-2">
                  <Label htmlFor="productCode">Product Code</Label>
                  <Input
                    id="productCode"
                    placeholder="Enter Product Code.."
                    value={formData.productCode}
                    onChange={(e) => handleChange("productCode", e.target.value)}
                  />
                </div>

                {/* Category with Add Button */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category<span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-3">
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleChange("category", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Search Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => setShowCategoryModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Category
                    </Button>
                  </div>
                </div>

                {/* Subcategory with Add Button */}
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <div className="flex gap-3">
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => handleChange("subcategory", value)}
                      disabled={!formData.category}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={formData.category ? "Search Subcategories" : "Select a category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.length > 0 ? (
                          filteredSubcategories.map((sub) => (
                            <SelectItem key={sub.value} value={sub.value}>
                              {sub.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No subcategories found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => setShowSubcategoryModal(true)}
                      disabled={!formData.category}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Subcategory
                    </Button>
                  </div>
                  {!formData.category && (
                    <p className="text-xs text-muted-foreground">Select a category first to enable subcategories</p>
                  )}
                </div>

                {/* Brand with Add Button */}
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <div className="flex gap-3">
                    <Select
                      value={formData.brand}
                      onValueChange={(value) => handleChange("brand", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Search Brands" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      className="text-primary border-primary hover:bg-primary/10"
                      onClick={() => setShowBrandModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Brand
                    </Button>
                  </div>
                </div>

                {/* Main Unit */}
                <div className="space-y-2">
                  <Label htmlFor="mainUnit">Main Unit</Label>
                  <Select
                    value={formData.mainUnit}
                    onValueChange={(value) => handleChange("mainUnit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Main Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pc">pc</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="l">L</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub Unit */}
                <div className="space-y-2">
                  <Label htmlFor="subUnit">Sub Unit</Label>
                  <Select
                    value={formData.subUnit}
                    onValueChange={(value) => handleChange("subUnit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No Related Unit Found" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Related Unit Found</SelectItem>
                      <SelectItem value="pc">pc</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Opening Stock */}
                <div className="space-y-2">
                  <Label htmlFor="openingStock">Opening Stock</Label>
                  <Input
                    id="openingStock"
                    type="number"
                    placeholder="pc"
                    value={formData.openingStock}
                    onChange={(e) => handleChange("openingStock", e.target.value)}
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-2">
                  <Label htmlFor="salePrice">
                    Sale Price<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="salePrice"
                    type="number"
                    placeholder="Enter Product price.."
                    value={formData.salePrice}
                    onChange={(e) => handleChange("salePrice", e.target.value)}
                    required
                  />
                </div>

                {/* Purchase Cost */}
                <div className="space-y-2">
                  <Label htmlFor="purchaseCost">
                    Purchase Cost<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="purchaseCost"
                    type="number"
                    placeholder="Enter Product cost.."
                    value={formData.purchaseCost}
                    onChange={(e) => handleChange("purchaseCost", e.target.value)}
                    required
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-2">
                  <Label htmlFor="productDetails">Product Details</Label>
                  <RichTextEditor
                    value={formData.productDetails}
                    onChange={(value) => handleChange("productDetails", value)}
                    placeholder="Enter product details..."
                  />
                </div>

                {/* Product Image */}
                <div className="space-y-2">
                  <Label htmlFor="productImage">Product Image</Label>
                  <Input
                    id="productImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange("productImage", e.target.files?.[0] || null)}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">Size: 298x284 pixels</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-center pt-4">
                  <Button type="submit" className="px-8">
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AddCategoryModal
        open={showCategoryModal}
        onOpenChange={setShowCategoryModal}
        onCategoryAdded={handleCategoryAdded}
      />
      <AddSubcategoryModal
        open={showSubcategoryModal}
        onOpenChange={setShowSubcategoryModal}
        categories={categories}
        selectedCategory={formData.category}
        onSubcategoryAdded={handleSubcategoryAdded}
      />
      <AddBrandModal
        open={showBrandModal}
        onOpenChange={setShowBrandModal}
        onBrandAdded={handleBrandAdded}
      />
    </DashboardLayout>
  );
};

export default AddProduct;
