"use client";

import { useState } from "react";
import { useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Filter, RotateCcw, Eye, Settings, Copy, Trash2, Printer, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const productsData = [
  { id: 1, code: "00000014", name: "my P", category: "Electronics", brand: "No Brand", price: 22.00, cost: 20.00 },
  { id: 2, code: "00000012", name: "Broiler Pre-Starter Crumble", category: "Poultry Feed", brand: "Mega Feed", price: 3400.00, cost: 3190.00 },
  { id: 3, code: "000011", name: "Gaming Laptop", category: "House", brand: "Samsung", price: 150000.00, cost: 145200.00 },
  { id: 4, code: "000010", name: "Dril Machine", category: "Document", brand: "Microsoft", price: 3000.00, cost: 2750.00 },
  { id: 5, code: "000009", name: "Blazer For Men", category: "Hardware", brand: "Microsoft", price: 3000.00, cost: 2500.00 },
  { id: 6, code: "000008", name: "Door Export", category: "Electronics", brand: "Nokia", price: 15000.00, cost: 13945.00 },
  { id: 7, code: "000007", name: "Air Condition", category: "Document", brand: "Microsoft", price: 96000.00, cost: 91350.00 },
  { id: 8, code: "000006", name: "Freez", category: "Electronics", brand: "Sony", price: 4500.00, cost: 4200.00 },
  { id: 9, code: "000005", name: "Ladis Shirt", category: "Electronics", brand: "Samsung", price: 900.00, cost: 700.00 },
  { id: 10, code: "000004", name: "T Shirt", category: "Electronics", brand: "Microsoft", price: 1500.00, cost: 1200.00 },
  { id: 11, code: "000003", name: "Desktop Computer", category: "Fashion", brand: "Sony", price: 458.00, cost: 375.00 },
  { id: 12, code: "000002", name: "laptop Computer", category: "Hardware", brand: "Microsoft", price: 78000.00, cost: 72000.00 },
  { id: 13, code: "000001", name: "Mobile Phone", category: "House", brand: "Nokia", price: 4500.00, cost: 4150.00 },
];

const Products = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    productCode: "",
    productName: "",
    category: "",
    brand: "",
    productDetails: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      productCode: "",
      productName: "",
      category: "",
      brand: "",
      productDetails: "",
    });
    setCurrentPage(1);
  };

  const filteredProducts = productsData.filter((product) => {
    const matchesCode = product.code.toLowerCase().includes(filters.productCode.toLowerCase());
    const matchesName = product.name.toLowerCase().includes(filters.productName.toLowerCase());
    const matchesCategory = !filters.category || filters.category === "all" || product.category.toLowerCase() === filters.category.toLowerCase();
    const matchesBrand = !filters.brand || filters.brand === "all" || product.brand.toLowerCase() === filters.brand.toLowerCase();
    return matchesCode && matchesName && matchesCategory && matchesBrand;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [...new Set(productsData.map((p) => p.category))];
  const brands = [...new Set(productsData.map((p) => p.brand))];

  const handleView = (id: number) => {
    toast({ title: "View Product", description: `Viewing product #${id}` });
  };

  const handleDelete = (id: number) => {
    toast({ title: "Product Deleted", description: `Product #${id} has been deleted.`, variant: "destructive" });
  };

  const handleCopy = (id: number) => {
    toast({ title: "Product Copied", description: `Product #${id} has been duplicated.` });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout title="Products">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
          <TabsTrigger
            value="products"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            PRODUCTS
          </TabsTrigger>
          <TabsTrigger
            value="add"
            onClick={() => navigate("/products/add")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 font-medium"
          >
            + ADD PRODUCT
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Product Code"
                  value={filters.productCode}
                  onChange={(e) => handleFilterChange("productCode", e.target.value)}
                />
                <Input
                  placeholder="Product Name"
                  value={filters.productName}
                  onChange={(e) => handleFilterChange("productName", e.target.value)}
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
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.brand}
                  onValueChange={(value) => handleFilterChange("brand", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand.toLowerCase()}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Input
                  placeholder="Product Details"
                  value={filters.productDetails}
                  onChange={(e) => handleFilterChange("productDetails", e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <div className="flex gap-3 mt-4">
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

          {/* Products Table */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Products</h3>
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
                      <TableHead className="text-primary-foreground font-semibold">Image</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Code</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Name</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Category</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Brand</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Price</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Cost</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Details</TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center">#</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProducts.map((product, index) => (
                      <TableRow key={product.id} className="hover:bg-muted/50">
                        <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell className="text-primary">{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.price.toFixed(2)} Tk</TableCell>
                        <TableCell>{product.cost.toFixed(2)} Tk</TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="default"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleView(product.id)}
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
                                <DropdownMenuItem onClick={() => navigate(`/products/edit/${product.id}`)}>
                                  Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopy(product.id)}>
                                  Duplicate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleCopy(product.id)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDelete(product.id)}
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
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Products;
