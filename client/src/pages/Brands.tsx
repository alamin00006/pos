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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Save, MoreHorizontal, Eye, Pencil, Trash2, Search, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Brand {
  id: number;
  name: string;
  code: string;
  logo: string;
  description: string;
  status: "Active" | "Inactive";
}

const Brands = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filter states
  const [filterName, setFilterName] = useState("");
  const [filterCode, setFilterCode] = useState("");

  // Form states
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Mock data
  const [brands, setBrands] = useState<Brand[]>([
    { id: 1, name: "Apple", code: "APL", logo: "", description: "Technology company", status: "Active" },
    { id: 2, name: "Samsung", code: "SAM", logo: "", description: "Electronics manufacturer", status: "Active" },
    { id: 3, name: "Sony", code: "SNY", logo: "", description: "Consumer electronics", status: "Active" },
    { id: 4, name: "LG", code: "LG", logo: "", description: "Home appliances", status: "Inactive" },
    { id: 5, name: "Dell", code: "DEL", logo: "", description: "Computer technology", status: "Active" },
  ]);

  const filteredBrands = brands.filter((brand) => {
    const matchesName = brand.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesCode = brand.code.toLowerCase().includes(filterCode.toLowerCase());
    return matchesName && matchesCode;
  });

  const totalPages = Math.ceil(filteredBrands.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + entriesPerPage);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBrandLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    setBrandLogo(null);
    setLogoPreview(null);
  };

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

    const newBrand: Brand = {
      id: brands.length + 1,
      name: brandName,
      code: brandName.substring(0, 3).toUpperCase(),
      logo: logoPreview || "",
      description: brandDescription,
      status: "Active",
    };

    setBrands([...brands, newBrand]);
    toast({
      title: "Brand Added",
      description: `${brandName} has been added successfully.`,
    });

    // Reset form
    setBrandName("");
    setBrandDescription("");
    setBrandLogo(null);
    setLogoPreview(null);
    setActiveTab("list");
  };

  const handleDelete = (id: number) => {
    setBrands(brands.filter((brand) => brand.id !== id));
    toast({
      title: "Brand Deleted",
      description: "Brand has been deleted successfully.",
    });
  };

  return (
    <DashboardLayout title="Brands">
      <div className="bg-card rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            <button
              onClick={() => setActiveTab("list")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "list"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              BRANDS
              {activeTab === "list" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "add"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              + ADD BRAND
              {activeTab === "add" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>
        </div>

        {activeTab === "list" ? (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Brand Code</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code..."
                    value={filterCode}
                    onChange={(e) => setFilterCode(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">SL</TableHead>
                    <TableHead className="font-semibold">Brand Name</TableHead>
                    <TableHead className="font-semibold">Brand Code</TableHead>
                    <TableHead className="font-semibold">Logo</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBrands.map((brand, index) => (
                    <TableRow key={brand.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>{brand.code}</TableCell>
                      <TableCell>
                        {brand.logo ? (
                          <img src={brand.logo} alt={brand.name} className="w-10 h-10 object-contain rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                            No Logo
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{brand.description}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            brand.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {brand.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(brand.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedBrands.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No brands found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Show</span>
                <Select
                  value={entriesPerPage.toString()}
                  onValueChange={(value) => {
                    setEntriesPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>entries</span>
                <span className="ml-4">
                  Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredBrands.length)} of {filteredBrands.length} entries
                </span>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-6">New Brand</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brandName">
                      Brand Name<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="brandName"
                      placeholder="Enter Brand Name..."
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandLogo">Brand Logo</Label>
                    <div className="flex items-center gap-2">
                      {logoPreview ? (
                        <div className="relative">
                          <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain rounded border" />
                          <button
                            type="button"
                            onClick={clearLogo}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Choose file...</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandDescription">Brand Description</Label>
                  <Textarea
                    id="brandDescription"
                    placeholder="Enter Brand Description..."
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className="px-8">
                    <Save className="w-4 h-4 mr-2" />
                    Save Brand
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Brands;
