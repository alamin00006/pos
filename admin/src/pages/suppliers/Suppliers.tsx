"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";

//  RTK hooks
import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
} from "@/redux/api/suppliersApi";
import { useNavigate } from "@/lib/router";

const Suppliers = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");

  // table controls
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  // form state (UI same)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    openingReceivable: "",
    openingPayable: "",
  });

  // API: list
  const {
    data: suppliersRes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSuppliersQuery({
    page,
    limit,
    search: search || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const suppliers = suppliersRes?.data ?? [];
  const meta = suppliersRes?.meta;

  //  API: create
  const [createSupplier, { isLoading: isCreating }] =
    useCreateSupplierMutation();

  //  API: delete
  const [deleteSupplier, { isLoading: isDeleting }] =
    useDeleteSupplierMutation();

  const totalPages = meta?.totalPages ?? 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Backend has openingBalance (single). Here we map openingPayable -> openingBalance.
      // If you need both receivable & payable, backend schema needs two fields.
      const openingBalance = Number(formData.openingPayable || 0);

      await createSupplier({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone,
        address: formData.address || undefined,
        openingBalance: openingBalance > 0 ? openingBalance : undefined,
      }).unwrap();

      toast({
        title: "Success",
        description: "Supplier added successfully!",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        openingReceivable: "",
        openingPayable: "",
      });

      setActiveTab("list");
      setPage(1);
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || err?.message || "Failed to add supplier",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      openingReceivable: "",
      openingPayable: "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id).unwrap();
      toast({ title: "Success", description: "Supplier deleted successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.data?.message || err?.message || "Failed to delete supplier",
        variant: "destructive",
      });
    }
  };

  const showingText = useMemo(() => {
    const total = meta?.total ?? suppliers.length;
    if (!meta) return `Showing 1 to ${suppliers.length} of ${total} entries`;
    const start = (meta.page - 1) * meta.limit + 1;
    const end = start + suppliers.length - 1;
    return `Showing ${suppliers.length ? start : 0} to ${
      suppliers.length ? end : 0
    } of ${total} entries`;
  }, [meta, suppliers.length]);

  return (
    <DashboardLayout title="Suppliers">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Supplier accounts
            </p>
            <h1 className="text-2xl font-semibold text-gray-950">Suppliers</h1>
            <p className="text-sm text-gray-500">
              Manage supplier profiles, opening balances, contact details, and purchase dues.
            </p>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger
              value="list"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              SUPPLIERS
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              + NEW SUPPLIER
            </TabsTrigger>
          </TabsList>

          {/* =========================
              ADD SUPPLIER
          ========================== */}
          <TabsContent value="add" className="mt-6">
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-950 mb-1">
                  New Supplier
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  Add a supplier account for purchase and payment tracking.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Supplier Name
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter Supplier Name..."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter Supplier Email..."
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Write Supplier Address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Enter Supplier Phone..."
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    {/* Backend: openingBalance only.
                       UI kept as-is. */}
                    <div className="space-y-2">
                      <Label htmlFor="openingReceivable">
                        Opening Receivable (UI only)
                      </Label>
                      <Input
                        id="openingReceivable"
                        type="number"
                        placeholder="0"
                        value={formData.openingReceivable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingReceivable: e.target.value,
                          })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingPayable">
                        Opening Payable (will save as Opening Balance)
                      </Label>
                      <Input
                        id="openingPayable"
                        type="number"
                        placeholder="0"
                        value={formData.openingPayable}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            openingPayable: e.target.value,
                          })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>

                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 gap-2"
                      disabled={isCreating}
                    >
                      <Save className="w-4 h-4" />
                      {isCreating ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =========================
              LIST SUPPLIERS
          ========================== */}
          <TabsContent value="list" className="mt-6">
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <select
                      className="border border-border rounded px-2 py-1 text-sm bg-background"
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-muted-foreground">
                      entries
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-3"
                      onClick={() => refetch()}
                      disabled={isFetching}
                    >
                      {isFetching ? "Refreshing..." : "Refresh"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Search:
                      </span>
                      <Input
                        placeholder="Search..."
                        className="w-48 h-9"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* errors */}
                {error && (
                  <div className="mb-4 text-sm text-destructive">
                    Failed to load suppliers.
                  </div>
                )}

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold">
                          SL
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold">
                          Details
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold">
                          Total Purchase
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold">
                          Total Paid
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold">
                          Due
                        </TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : suppliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="py-10 text-center">
                            No suppliers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        suppliers.map((supplier: any, index: number) => (
                          <TableRow
                            key={supplier.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              {(page - 1) * limit + index + 1}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{supplier.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Phone: {supplier.phone || "—"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Email: {supplier.email || "—"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Address: {supplier.address || "—"}
                                </p>
                              </div>
                            </TableCell>

                            {/* Backend doesn’t provide these in your service */}
                            <TableCell>—</TableCell>
                            <TableCell>—</TableCell>

                            <TableCell
                              className={
                                Number(supplier.due || 0) > 0
                                  ? "text-destructive font-medium"
                                  : ""
                              }
                            >
                              ৳ {Number(supplier.due || 0).toLocaleString()}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent
                                    align="end"
                                    className="bg-popover"
                                  >
                                    <DropdownMenuItem
                                      className="gap-2 cursor-pointer"
                                      onClick={() =>
                                        navigate(`/suppliers/${supplier.id}`)
                                      }
                                    >
                                      <Eye className="w-4 h-4" />
                                      View
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="gap-2 cursor-pointer"
                                      onClick={() =>
                                        navigate(
                                          `/suppliers/${supplier.id}/edit`,
                                        )
                                      }
                                    >
                                      <Pencil className="w-4 h-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(
                                          `/suppliers/${supplier.id}/report`,
                                        )
                                      }
                                    >
                                      Report
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(
                                          `/suppliers/${supplier.id}/ledger`,
                                        )
                                      }
                                    >
                                      Ledger
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(
                                          `/suppliers/${supplier.id}/purchases`,
                                        )
                                      }
                                    >
                                      Purchase List
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() =>
                                        navigate(
                                          `/suppliers/${supplier.id}/payments`,
                                        )
                                      }
                                    >
                                      Payments List
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      className="gap-2 cursor-pointer text-destructive"
                                      onClick={() => handleDelete(supplier.id)}
                                      disabled={isDeleting}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4">
                  <p className="text-sm text-muted-foreground">{showingText}</p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>

                    <Button variant="default" size="sm" className="bg-primary">
                      {page}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Suppliers;
