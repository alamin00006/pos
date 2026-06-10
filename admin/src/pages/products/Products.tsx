"use client";

import { useMemo, useState } from "react";
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
import {
  Filter,
  RotateCcw,
  Eye,
  Settings,
  Trash2,
  Printer,
  ImageIcon,
  Package,
  Barcode,
  QrCode,
} from "lucide-react";

//  RTK hooks
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/redux/api/productsApi";

import type { Product, ProductListQuery } from "@/types/product";
import toast from "react-hot-toast";
import ProductDetailsModal from "./ProductDetailsModal";

const getProductCode = (product: any) =>
  String(product?.productCode ?? product?.product_code ?? product?.code ?? "");

const getProductDetails = (product: any) =>
  String(product?.description ?? product?.details ?? "").replace(/<[^>]*>/g, "");

const getProductCost = (product: any) =>
  Number(product?.costPrice ?? product?.cost ?? product?.buyPrice ?? 0);

const Products = () => {
  const navigate = useNavigate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  // UI filter inputs (typing state)
  const [filters, setFilters] = useState({
    productCode: "",
    productName: "",
    category: "all",
    brand: "all",
    productDetails: "",
  });

  const [applied, setApplied] = useState({ ...filters });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  //  Query params (server-side filter/pagination)
  const queryParams: ProductListQuery = useMemo(
    () => ({
      page: currentPage,
      limit: itemsPerPage,

      code: applied.productCode || undefined,
      name: applied.productName || undefined,
      category:
        !applied.category || applied.category === "all"
          ? undefined
          : applied.category,
      brand:
        !applied.brand || applied.brand === "all" ? undefined : applied.brand,
      details: applied.productDetails || undefined,
    }),
    [applied, currentPage],
  );

  const {
    data: productsRes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProductsQuery(queryParams) as any;

  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const items: Product[] = productsRes?.data ?? [];
  const meta = productsRes?.meta ?? productsRes?.data?.meta;

  const totalItems = meta?.total ?? items.length; // fallback
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          items.map((p: any) => p.category?.name ?? p.category).filter(Boolean),
        ),
      ),
    [items],
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          items.map((p: any) => p.brand?.name ?? p.brand).filter(Boolean),
        ),
      ),
    [items],
  );

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    setApplied(filters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    const cleared = {
      productCode: "",
      productName: "",
      category: "all",
      brand: "all",
      productDetails: "",
    };
    setFilters(cleared);
    setApplied(cleared);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success(`Product #${id} deleted successfully.`);
    } catch (e: any) {
      toast.error(e?.data?.message ?? "Something went wrong");
    }
  };

  const handlePrint = () => window.print();

  return (
    <DashboardLayout title="Products">
      <div className="space-y-6">
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
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">
                  <Filter className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Filter products</h2>
                  <p className="text-sm text-muted-foreground">
                    Search product records before printing or editing.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Product Code"
                  value={filters.productCode}
                  onChange={(e) =>
                    handleFilterChange("productCode", e.target.value)
                  }
                />
                <Input
                  placeholder="Product Name"
                  value={filters.productName}
                  onChange={(e) =>
                    handleFilterChange("productName", e.target.value)
                  }
                />

                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={String(cat)} value={String(cat)}>
                        {String(cat)}
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
                    {brands.map((b: any) => (
                      <SelectItem key={String(b)} value={String(b)}>
                        {String(b)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Input
                  placeholder="Product Details"
                  value={filters.productDetails}
                  onChange={(e) =>
                    handleFilterChange("productDetails", e.target.value)
                  }
                  className="max-w-xs"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleApplyFilter}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>

                <Button variant="secondary" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>

                <Button variant="outline" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Products</h3>
                    <p className="text-sm text-muted-foreground">
                      Showing {totalItems} catalog records
                    </p>
                  </div>
                  {isFetching ? (
                    <span className="text-sm text-muted-foreground">
                      Updating...
                    </span>
                  ) : null}
                </div>

                <Button
                  variant="outline"
                  className="text-primary border-primary"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>

              {error ? (
                <div className="text-sm text-destructive mb-3">
                  Failed to load products.
                </div>
              ) : null}

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground font-semibold">
                        #
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Image
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Code
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Category
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Brand
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Price
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Cost
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold">
                        Details
                      </TableHead>
                      <TableHead className="text-primary-foreground font-semibold text-center">
                        #
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="py-10 text-center">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="py-10 text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((product: any, index: number) => (
                        <TableRow
                          key={product.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell>
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </TableCell>

                          <TableCell>
                            <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
                              <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </TableCell>

                          <TableCell className="text-primary">
                            {getProductCode(product) || "-"}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            {product.category?.name ?? product.category ?? "-"}
                          </TableCell>
                          <TableCell>
                            {product.brand?.name ?? product.brand ?? "-"}
                          </TableCell>
                          <TableCell>
                            {Number(
                              product.price ?? product.sellPrice ?? 0,
                            ).toFixed(2)}{" "}
                            Tk
                          </TableCell>
                          <TableCell>
                            {getProductCost(product).toFixed(2)}{" "}
                            Tk
                          </TableCell>

                          <TableCell className="max-w-[220px] truncate">
                            {getProductDetails(product) || "-"}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setSelectedId(product.id);
                                  setDetailsOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(`/products/edit/${product.id}`)
                                    }
                                  >
                                    Edit Product
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                title="Barcode"
                                onClick={() =>
                                  navigate(`/products/barcode/${product.id}`)
                                }
                              >
                                <Barcode className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                title="QR Code"
                                onClick={() =>
                                  navigate(`/products/qr/${product.id}`)
                                }
                              >
                                <QrCode className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={deleting}
                                onClick={() => handleDelete(String(product.id))}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ),
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
              <ProductDetailsModal
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                productId={selectedId as string}
              />

              <div className="mt-4 text-sm text-muted-foreground">
                Showing{" "}
                {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                {totalItems} entries
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Products;
