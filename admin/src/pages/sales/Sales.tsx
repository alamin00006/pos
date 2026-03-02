"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Filter,
  RotateCcw,
  Printer,
  Settings2,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useGetSalesQuery,
  useGetTodaySalesQuery,
  useGetSalesReportQuery,
  useGetSaleByIdQuery,
  useGetSaleReceiptQuery,
  useDeleteSaleMutation,
  useAddSalePaymentMutation,
  useDuplicateSaleMutation,
  useRefundSaleMutation,
} from "@/redux/api/salesApi";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { useGetCustomersQuery } from "@/redux/api/customerApi";

interface SaleItem {
  productId: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Sale {
  id: string;
  invoiceNo: string;
  customerId?: string;
  customerName: string;
  items: SaleItem[];
  createdAt: string;
  discount: number;
  discountType?: "PERCENTAGE" | "FIXED";
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  due: number;
  returned: number;
  purchaseCost: number;
  profit: number;
  status: "PAID" | "UNPAID" | "PARTIAL" | "REFUNDED";
  note?: string;
  payments: {
    id: string;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
  }[];
}

interface PaymentData {
  amount: number;
  paymentMethod: string;
  note?: string;
  paymentDate?: Date;
}

interface RefundData {
  items: {
    productId: string;
    quantity: number;
    reason?: string;
  }[];
  note?: string;
}

const Sales = () => {
  // Filter states
  const [billNumber, setBillNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [customerId, setCustomerId] = useState<string>("all");
  const [productId, setProductId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Dialog states
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>("");

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [paymentNote, setPaymentNote] = useState("");

  // Refund form
  const [refundItems, setRefundItems] = useState<
    { productId: string; quantity: number; reason: string }[]
  >([]);
  const [refundNote, setRefundNote] = useState("");

  // API Hooks
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();
  const [addPayment, { isLoading: isAddingPayment }] =
    useAddSalePaymentMutation();
  const [duplicateSale, { isLoading: isDuplicating }] =
    useDuplicateSaleMutation();
  const [refundSale, { isLoading: isRefunding }] = useRefundSaleMutation();

  // Build query params
  const queryParams = {
    page,
    limit,
    search: billNumber || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    customerId: customerId !== "all" ? customerId : undefined,
    productId: productId !== "all" ? productId : undefined,
    status: status !== "all" ? status : undefined,
  };

  // Fetch data
  const { data: salesData, isLoading, refetch } = useGetSalesQuery(queryParams);
  const { data: todaySalesData } = useGetTodaySalesQuery();
  const { data: reportData } = useGetSalesReportQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const { data: customersData } = useGetCustomersQuery({ page: 1, limit: 100 });
  const { data: productsData } = useGetProductsQuery({ page: 1, limit: 100 });
  const { data: receiptData } = useGetSaleReceiptQuery(selectedSale?.id || "", {
    skip: !selectedSale?.id || !isReceiptDialogOpen,
  });

  const sales = salesData?.data || [];
  const total = salesData?.meta?.total || 0;
  const totalPage = salesData?.meta?.totalPage || 1;
  const customers = customersData?.data || [];
  const products = productsData?.data || [];

  console.log(sales);
  // Today's stats
  const todayStats = [
    {
      label: "Sold Today:",
      value: `${todaySalesData?.totalAmount?.toLocaleString() || 0} Tk`,
      bg: "bg-[hsl(172,66%,45%)]",
    },
    {
      label: "Today Received:",
      value: `${todaySalesData?.totalPaid?.toLocaleString() || 0} Tk`,
      bg: "bg-[hsl(172,66%,50%)]",
    },
    {
      label: "Today Profit:",
      value: `${todaySalesData?.totalProfit?.toLocaleString() || 0} Tk`,
      bg: "bg-[hsl(172,66%,45%)]",
    },
    {
      label: "Total Sold:",
      value: `${reportData?.totalAmount?.toLocaleString() || 0} Tk`,
      bg: "bg-[hsl(172,66%,50%)]",
    },
  ];

  const handleReset = () => {
    setBillNumber("");
    setStartDate("");
    setEndDate("");
    setCustomerId("all");
    setProductId("all");
    setStatus("all");
    setPage(1);
  };

  const handleFilter = () => {
    setPage(1);
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this sale?")) {
      try {
        await deleteSale(id).unwrap();
        toast.success("Sale deleted successfully");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete sale");
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateSale(id).unwrap();
      toast.success("Sale duplicated successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to duplicate sale");
    }
  };

  const handleAddPayment = async () => {
    if (!selectedSale) return;
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await addPayment({
        id: selectedSale.id,
        data: {
          amount: paymentAmount,
          paymentMethod,
          note: paymentNote,
          paymentDate: new Date(),
        },
      }).unwrap();

      toast.success("Payment added successfully");
      setIsPaymentDialogOpen(false);
      setPaymentAmount(0);
      setPaymentNote("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add payment");
    }
  };

  const handleRefund = async () => {
    if (!selectedSale) return;
    if (refundItems.length === 0) {
      toast.error("Please select items to refund");
      return;
    }

    try {
      await refundSale({
        id: selectedSale.id,
        data: {
          items: refundItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            reason: item.reason,
          })),
          note: refundNote,
        },
      }).unwrap();

      toast.success("Refund processed successfully");
      setIsRefundDialogOpen(false);
      setRefundItems([]);
      setRefundNote("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to process refund");
    }
  };

  const handlePrintReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setIsReceiptDialogOpen(true);
  };

  useEffect(() => {
    if (receiptData?.url) {
      setReceiptUrl(receiptData.url);
      window.open(receiptData.url, "_blank");
    }
  }, [receiptData]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      PAID: "bg-green-100 text-green-800 hover:bg-green-200",
      UNPAID: "bg-red-100 text-red-800 hover:bg-red-200",
      PARTIAL: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      REFUNDED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout title="Sale">
      {/* Summary Stats */}
      <div className="flex flex-wrap justify-center gap-0 mb-6">
        {todayStats.map((stat, index) => (
          <div key={index} className="flex">
            <div
              className={`${stat.bg} text-white px-6 py-2 font-medium ${index === 0 ? "rounded-l-md" : ""}`}
            >
              {stat.label}
            </div>
            <div className="bg-primary text-white px-6 py-2 font-bold">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
          <TabsTrigger
            value="sales"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
          >
            SALES
          </TabsTrigger>
          <TabsTrigger
            value="new-sale"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            asChild
          >
            <Link href="/pos">+ NEW SALE</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-0">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Bill Number / Invoice No"
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={productId} onValueChange={setProductId}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    {products.map((product: any) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                    <SelectItem value="UNPAID">Unpaid</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleFilter}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sales Table */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-semibold">Sale List</h3>
                <Badge variant="outline" className="text-sm">
                  Total: {total} Sales
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[hsl(172,66%,40%)] hover:bg-[hsl(172,66%,40%)]">
                      <TableHead className="text-white font-semibold">
                        #
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Invoice No.
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Customer
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Items
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Date
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Discount
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Receivable
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Paid
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Due
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Profit
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : sales.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-10">
                          <p className="text-gray-500">No sales found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sales.map((sale: Sale, index: number) => (
                        <TableRow key={sale.id}>
                          <TableCell>
                            {(page - 1) * limit + index + 1}
                          </TableCell>
                          <TableCell className="text-primary font-medium">
                            {sale.invoiceNo}
                          </TableCell>
                          <TableCell>
                            {sale.customerName || "Walk-in Customer"}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-xs">
                              {sale.saleItems?.slice(0, 2).map((item, i) => (
                                <div key={i} className="truncate">
                                  {item.productName} x{item.quantity}
                                </div>
                              ))}
                              {sale.saleItems?.length > 2 && (
                                <Badge variant="outline" className="mt-1">
                                  +{sale.saleItems?.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {sale.discount > 0 ? (
                              <Badge variant="outline" className="bg-blue-50">
                                {sale.discountType === "PERCENTAGE"
                                  ? `${sale.discount}%`
                                  : `৳${sale.discount}`}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            ৳{sale.total.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-green-600">
                            ৳{sale.paid.toLocaleString()}
                          </TableCell>
                          <TableCell
                            className={
                              sale.due > 0 ? "text-red-600 font-medium" : ""
                            }
                          >
                            ৳{sale.due.toLocaleString()}
                          </TableCell>
                          <TableCell
                            className={
                              sale.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            ৳{sale.profit.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadge(sale.status)}>
                              {sale.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  <Settings2 className="w-4 h-4 mr-1" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedSale(sale);
                                    setIsViewDialogOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePrintReceipt(sale)}
                                >
                                  <Receipt className="w-4 h-4 mr-2" />
                                  Print Receipt
                                </DropdownMenuItem>
                                {sale.due > 0 && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedSale(sale);
                                      setPaymentAmount(sale.due);
                                      setIsPaymentDialogOpen(true);
                                    }}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Payment
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDuplicate(sale.id)}
                                  disabled={isDuplicating}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                {sale.status !== "REFUNDED" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedSale(sale);
                                      const items = sale.items.map((item) => ({
                                        productId: item.productId,
                                        quantity: 0,
                                        reason: "",
                                      }));
                                      setRefundItems(items);
                                      setIsRefundDialogOpen(true);
                                    }}
                                  >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Refund
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(sale.id)}
                                  disabled={isDeleting}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPage > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                  <div className="text-sm text-gray-600">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, total)} of {total} entries
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPage) },
                        (_, i) => {
                          let pageNum = i + 1;
                          if (totalPage > 5) {
                            if (page > 3) {
                              pageNum = page - 3 + i;
                            }
                          }
                          return pageNum <= totalPage ? (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className={page === pageNum ? "bg-primary" : ""}
                            >
                              {pageNum}
                            </Button>
                          ) : null;
                        },
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                      disabled={page === totalPage}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Sale Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Sale Details - Invoice #{selectedSale?.invoiceNo}
            </DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">
                    {selectedSale.customerName || "Walk-in Customer"}
                  </p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p>{new Date(selectedSale.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusBadge(selectedSale.status)}>
                    {selectedSale.status}
                  </Badge>
                </div>
                <div>
                  <Label>Note</Label>
                  <p>{selectedSale.note || "No note"}</p>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>৳{item.unitPrice}</TableCell>
                        <TableCell>
                          {item.discount > 0 ? `৳${item.discount}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ৳{item.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payments</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedSale.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell className="text-right">
                            ৳{payment.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      ৳{selectedSale.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>৳{selectedSale.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>
                      {selectedSale.discount > 0
                        ? selectedSale.discountType === "PERCENTAGE"
                          ? `${selectedSale.discount}%`
                          : `৳${selectedSale.discount}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>৳{selectedSale.total.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span>৳{selectedSale.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Due:</span>
                    <span>৳{selectedSale.due.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Invoice #</Label>
              <p className="font-medium">{selectedSale?.invoiceNo}</p>
            </div>
            <div>
              <Label>Due Amount</Label>
              <p className="text-lg font-bold text-red-600">
                ৳{selectedSale?.due.toLocaleString()}
              </p>
            </div>
            <div>
              <Label>Payment Amount *</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="BKASH">bKash</SelectItem>
                  <SelectItem value="BANK">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Note</Label>
              <Textarea
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="Add note..."
              />
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={handleAddPayment}
              disabled={isAddingPayment}
            >
              {isAddingPayment ? "Processing..." : "Add Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Process Refund - Invoice #{selectedSale?.invoiceNo}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Select Items to Refund</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Purchased</TableHead>
                    <TableHead>Refund Qty</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSale?.items.map((item, index) => (
                    <TableRow key={item.productId}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={
                            refundItems.find(
                              (r) => r.productId === item.productId,
                            )?.quantity || 0
                          }
                          onChange={(e) => {
                            const newItems = [...refundItems];
                            const existing = newItems.find(
                              (r) => r.productId === item.productId,
                            );
                            if (existing) {
                              existing.quantity = Number(e.target.value);
                            } else {
                              newItems.push({
                                productId: item.productId,
                                quantity: Number(e.target.value),
                                reason: "",
                              });
                            }
                            setRefundItems(newItems);
                          }}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Reason"
                          value={
                            refundItems.find(
                              (r) => r.productId === item.productId,
                            )?.reason || ""
                          }
                          onChange={(e) => {
                            const newItems = [...refundItems];
                            const existing = newItems.find(
                              (r) => r.productId === item.productId,
                            );
                            if (existing) {
                              existing.reason = e.target.value;
                            } else {
                              newItems.push({
                                productId: item.productId,
                                quantity: 0,
                                reason: e.target.value,
                              });
                            }
                            setRefundItems(newItems);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <Label>Refund Note</Label>
              <Textarea
                value={refundNote}
                onChange={(e) => setRefundNote(e.target.value)}
                placeholder="Add refund note..."
              />
            </div>
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={handleRefund}
              disabled={isRefunding}
            >
              {isRefunding ? "Processing..." : "Process Refund"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground mt-8">
        Copyright © 2026{" "}
        <span className="text-primary font-medium">SOFTGHOR</span>. All rights
        reserved.
      </div>
    </DashboardLayout>
  );
};

export default Sales;
