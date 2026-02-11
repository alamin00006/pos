"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Filter, RotateCcw, Eye, Settings, Trash2, Printer, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const subcategoriesData = [
  { id: 1, name: "Rice", code: "GRO-RICE", categoryId: "grocery", categoryName: "Grocery", status: "Active" },
  { id: 2, name: "Flour", code: "GRO-FLOUR", categoryId: "grocery", categoryName: "Grocery", status: "Active" },
  { id: 3, name: "Cooking Oil", code: "GRO-OIL", categoryId: "grocery", categoryName: "Grocery", status: "Active" },
  { id: 4, name: "Milk", code: "DAI-MILK", categoryId: "dairy", categoryName: "Dairy", status: "Active" },
  { id: 5, name: "Cheese", code: "DAI-CHEESE", categoryId: "dairy", categoryName: "Dairy", status: "Active" },
  { id: 6, name: "Yogurt", code: "DAI-YOGURT", categoryId: "dairy", categoryName: "Dairy", status: "Active" },
  { id: 7, name: "Bread", code: "BAK-BREAD", categoryId: "bakery", categoryName: "Bakery", status: "Active" },
  { id: 8, name: "Pastries", code: "BAK-PASTRY", categoryId: "bakery", categoryName: "Bakery", status: "Active" },
  { id: 9, name: "Cookies", code: "SNK-COOKIE", categoryId: "snacks", categoryName: "Snacks", status: "Active" },
  { id: 10, name: "Chips", code: "SNK-CHIPS", categoryId: "snacks", categoryName: "Snacks", status: "Active" },
  { id: 11, name: "Juice", code: "BEV-JUICE", categoryId: "beverages", categoryName: "Beverages", status: "Active" },
  { id: 12, name: "Soda", code: "BEV-SODA", categoryId: "beverages", categoryName: "Beverages", status: "Inactive" },
];

const categoriesData = [
  { value: "grocery", label: "Grocery" },
  { value: "dairy", label: "Dairy" },
  { value: "bakery", label: "Bakery" },
  { value: "snacks", label: "Snacks" },
  { value: "beverages", label: "Beverages" },
  { value: "household", label: "Household" },
];

const Subcategories = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    subcategoryName: "",
    subcategoryCode: "",
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add subcategory form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      subcategoryName: "",
      subcategoryCode: "",
      category: "",
    });
    setCurrentPage(1);
  };

  const filteredSubcategories = subcategoriesData.filter((sub) => {
    const matchesName = sub.name.toLowerCase().includes(filters.subcategoryName.toLowerCase());
    const matchesCode = sub.code.toLowerCase().includes(filters.subcategoryCode.toLowerCase());
    const matchesCategory = !filters.category || filters.category === "all" || sub.categoryId === filters.category;
    return matchesName && matchesCode && matchesCategory;
  });

  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const paginatedSubcategories = filteredSubcategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleView = (id: number) => {
    toast({ title: "View Subcategory", description: `Viewing subcategory #${id}` });
  };

  const handleDelete = (id: number) => {
    toast({ title: "Subcategory Deleted", description: `Subcategory #${id} has been deleted.`, variant: "destructive" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Subcategory name and category are required",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Subcategory Added",
      description: `${formData.name} has been added successfully.`,
    });
    setFormData({ name: "", code: "", category: "" });
  };

  return (
    <DashboardLayout title="Subcategories">
      <Tabs defaultValue="subcategories" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger
            value="subcategories"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            SUBCATEGORIES
          </TabsTrigger>
          <TabsTrigger
            value="add"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            + ADD SUBCATEGORY
          </TabsTrigger>
        </TabsList>

        {/* Subcategories List Tab */}
        <TabsContent value="subcategories" className="mt-0 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  placeholder="Subcategory Name"
                  value={filters.subcategoryName}
                  onChange={(e) => handleFilterChange("subcategoryName", e.target.value)}
                />
                <Input
                  placeholder="Subcategory Code"
                  value={filters.subcategoryCode}
                  onChange={(e) => handleFilterChange("subcategoryCode", e.target.value)}
                />
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoriesData.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subcategories Table */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Subcategories</h3>
                <Button variant="outline" className="text-primary border-primary" onClick={handlePrint}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground font-semibold">#</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Subcategory Name</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Code</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Parent Category</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubcategories.map((sub, index) => (
                      <TableRow key={sub.id} className="hover:bg-muted/50">
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell className="font-medium">{sub.name}</TableCell>
                        <TableCell className="text-primary">{sub.code}</TableCell>
                        <TableCell>{sub.categoryName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            sub.status === "Active" 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {sub.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="default"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleView(sub.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="default" size="icon" className="h-8 w-8">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Subcategory</DropdownMenuItem>
                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(sub.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredSubcategories.length)} of {filteredSubcategories.length} entries
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Subcategory Tab */}
        <TabsContent value="add" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">Add New Subcategory</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Parent Category<span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleFormChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Parent Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Subcategory Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter Subcategory Name.."
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">Subcategory Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter Subcategory Code.."
                    value={formData.code}
                    onChange={(e) => handleFormChange("code", e.target.value)}
                  />
                </div>

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
    </DashboardLayout>
  );
};

export default Subcategories;
