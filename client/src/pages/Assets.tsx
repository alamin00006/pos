import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Eye, Edit, Trash2 } from "lucide-react";

const assetsData = [
  {
    id: 1,
    name: "Computer",
    quantity: 5,
    purchasePrice: 50000,
    forcedSalePrice: 40000,
    note: "Office computers",
  },
  {
    id: 2,
    name: "Printer",
    quantity: 2,
    purchasePrice: 15000,
    forcedSalePrice: 12000,
    note: "Laser printers",
  },
  {
    id: 3,
    name: "Furniture",
    quantity: 10,
    purchasePrice: 25000,
    forcedSalePrice: 20000,
    note: "Office desks and chairs",
  },
];

const Assets = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("add");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    purchasePrice: "",
    forcedSalePrice: "",
    note: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAsset = () => {
    if (!formData.name || !formData.quantity || !formData.purchasePrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Asset Added",
      description: "New asset has been added successfully.",
    });

    // Reset form
    setFormData({
      name: "",
      quantity: "",
      purchasePrice: "",
      forcedSalePrice: "",
      note: "",
    });
  };

  const filteredAssets = assetsData.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Assets">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary">Add Assets</h1>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="assets"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Package className="w-4 h-4" />
              ASSETS
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              + ADD ASSETS
            </TabsTrigger>
          </TabsList>

          {/* Assets List Tab */}
          <TabsContent value="assets" className="mt-0 space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button onClick={() => window.print()}>Print</Button>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(172,66%,40%)] hover:bg-[hsl(172,66%,40%)]">
                    <TableHead className="text-white font-semibold">SL</TableHead>
                    <TableHead className="text-white font-semibold">Name</TableHead>
                    <TableHead className="text-white font-semibold">
                      Quantity
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Purchase Price
                    </TableHead>
                    <TableHead className="text-white font-semibold">
                      Forced Sale Price
                    </TableHead>
                    <TableHead className="text-white font-semibold">Note</TableHead>
                    <TableHead className="text-white font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No assets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssets.map((asset, index) => (
                      <TableRow key={asset.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{asset.name}</TableCell>
                        <TableCell>{asset.quantity}</TableCell>
                        <TableCell>৳{asset.purchasePrice.toLocaleString()}</TableCell>
                        <TableCell>৳{asset.forcedSalePrice.toLocaleString()}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {asset.note}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Add Assets Form Tab */}
          <TabsContent value="add" className="mt-0">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground">Add Assets</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      placeholder="Enter asset name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", e.target.value)}
                    />
                  </div>

                  {/* Purchase Price */}
                  <div className="space-y-2">
                    <Label>Purchase Price</Label>
                    <Input
                      type="number"
                      placeholder="Enter purchase price"
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        handleInputChange("purchasePrice", e.target.value)
                      }
                    />
                  </div>

                  {/* Forced Sale Price */}
                  <div className="space-y-2">
                    <Label>Forced Sale Price</Label>
                    <Input
                      type="number"
                      placeholder="Enter forced sale price"
                      value={formData.forcedSalePrice}
                      onChange={(e) =>
                        handleInputChange("forcedSalePrice", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Note */}
                <div className="space-y-2">
                  <Label>Note</Label>
                  <Textarea
                    placeholder="Enter notes about the asset"
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    rows={5}
                  />
                </div>

                {/* Add Button */}
                <div className="flex justify-center pt-4">
                  <Button onClick={handleAddAsset}>Add Asset</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">SOFTGHOR</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default Assets;
