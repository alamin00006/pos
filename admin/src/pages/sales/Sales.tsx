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
import { Separator } from "@/components/ui/separator";
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
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  useGetSalesQuery,
  useGetTodaySalesQuery,
  useGetSalesReportQuery,
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
  saleItems?: SaleItem[];
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

const toNumber = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const formatMoney = (value: unknown) => `৳${toNumber(value).toLocaleString()}`;

const normalizeSaleItem = (item: any): SaleItem => ({
  productId: item.productId ?? item.product?.id ?? "",
  productName: item.productName ?? item.product?.name ?? "Unknown product",
  productCode: item.productCode ?? item.product?.productCode ?? "",
  quantity: toNumber(item.quantity),
  unitPrice: toNumber(item.unitPrice),
  discount: toNumber(item.discount),
  total: toNumber(item.total),
});

const normalizeSale = (sale: any): Sale => {
  const saleItems = (sale.saleItems ?? sale.items ?? []).map(normalizeSaleItem);
  const paid = toNumber(sale.paid ?? sale.paidAmount);
  const due = toNumber(sale.due ?? sale.dueAmount);
  const total = toNumber(sale.total);

  return {
    ...sale,
    customerName: sale.customerName ?? sale.customer?.name ?? "Walk-in Customer",
    items: saleItems,
    saleItems,
    createdAt: sale.createdAt ?? sale.saleDate ?? new Date().toISOString(),
    discount: toNumber(sale.discount),
    subtotal: toNumber(sale.subtotal),
    tax: toNumber(sale.tax),
    total,
    paid,
    due,
    returned: toNumber(sale.returned),
    purchaseCost: toNumber(sale.purchaseCost),
    profit: toNumber(sale.profit),
    status:
      sale.status === "REFUNDED"
        ? "REFUNDED"
        : sale.paymentStatus ?? (due <= 0 ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID"),
    payments: sale.payments ?? [],
  };
};

const openReceiptPrintWindow = (receipt: any) => {
  const sale = normalizeSale(receipt?.sale ?? receipt?.data?.sale ?? {});
  const company = receipt?.company ?? receipt?.data?.company ?? {};
  const shopName = company.company_name || company.shop_name || "POS Software";
  const rows = sale.items
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.productName)}</td>
          <td class="right">${item.quantity}</td>
          <td class="right">${formatMoney(item.unitPrice)}</td>
          <td class="right">${formatMoney(item.total)}</td>
        </tr>
      `,
    )
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <title>Receipt ${escapeHtml(sale.invoiceNo || "")}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, sans-serif; color: #111827; background: #f3f4f6; }
          .receipt { width: 320px; margin: 24px auto; background: #fff; padding: 18px; border: 1px solid #e5e7eb; }
          .center { text-align: center; }
          .muted { color: #6b7280; font-size: 12px; }
          h1 { margin: 0 0 4px; font-size: 20px; }
          .meta { margin: 14px 0; border-top: 1px dashed #d1d5db; border-bottom: 1px dashed #d1d5db; padding: 10px 0; font-size: 12px; }
          .line { display: flex; justify-content: space-between; gap: 10px; margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { border-bottom: 1px solid #111827; padding: 6px 0; text-align: left; }
          td { border-bottom: 1px dashed #e5e7eb; padding: 6px 0; vertical-align: top; }
          .right { text-align: right; }
          .totals { margin-top: 10px; font-size: 13px; }
          .total { font-size: 16px; font-weight: 700; }
          .thanks { margin-top: 16px; font-size: 12px; }
          @media print {
            body { background: #fff; }
            .receipt { width: 80mm; margin: 0; border: 0; }
          }
        </style>
      </head>
      <body>
        <main class="receipt">
          <header class="center">
            <h1>${escapeHtml(shopName)}</h1>
            <div class="muted">${escapeHtml(company.company_address || "")}</div>
            <div class="muted">${escapeHtml(company.company_phone || "")}</div>
          </header>
          <section class="meta">
            <div class="line"><span>Invoice</span><strong>${escapeHtml(sale.invoiceNo || "-")}</strong></div>
            <div class="line"><span>Date</span><span>${new Date(sale.createdAt).toLocaleString()}</span></div>
            <div class="line"><span>Customer</span><span>${escapeHtml(sale.customerName)}</span></div>
          </section>
          <table>
            <thead>
              <tr><th>Item</th><th class="right">Qty</th><th class="right">Rate</th><th class="right">Total</th></tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <section class="totals">
            <div class="line"><span>Subtotal</span><span>${formatMoney(sale.subtotal)}</span></div>
            <div class="line"><span>Discount</span><span>${formatMoney(sale.discount)}</span></div>
            <div class="line"><span>Tax</span><span>${formatMoney(sale.tax)}</span></div>
            <div class="line total"><span>Total</span><span>${formatMoney(sale.total)}</span></div>
            <div class="line"><span>Paid</span><span>${formatMoney(sale.paid)}</span></div>
            <div class="line"><span>Due</span><span>${formatMoney(sale.due)}</span></div>
          </section>
          <p class="center thanks">Thank you for shopping with us.</p>
        </main>
        <script>window.onload = () => { window.print(); };</script>
      </body>
    </html>
  `;

  const receiptWindow = window.open("", "_blank", "width=420,height=720");
  if (!receiptWindow) {
    toast.error("Please allow popups to print receipt");
    return;
  }
  receiptWindow.document.open();
  receiptWindow.document.write(html);
  receiptWindow.document.close();
};

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [paymentNote, setPaymentNote] = useState("");

  // Refund form
  const [refundItems, setRefundItems] = useState<
    { productId: string; quantity: number; unitPrice: number; reason: string }[]
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

  const sales = (salesData?.data || []).map(normalizeSale);
  const total = salesData?.meta?.total || 0;
  const totalPage = salesData?.meta?.totalPage || 1;
  const customers = customersData?.data || [];
  const products = productsData?.data || [];

  // Today's stats
  const todayStats = [
    {
      label: "Sold Today:",
      value: `${todaySalesData?.totalAmount?.toLocaleString() || 0} Tk`,
      bg: "bg-primary",
    },
    {
      label: "Today Received:",
      value: `${todaySalesData?.totalPaid?.toLocaleString() || 0} Tk`,
      bg: "bg-primary",
    },
    {
      label: "Today Profit:",
      value: `${todaySalesData?.totalProfit?.toLocaleString() || 0} Tk`,
      bg: "bg-primary",
    },
    {
      label: "Total Sold:",
      value: `${reportData?.totalAmount?.toLocaleString() || 0} Tk`,
      bg: "bg-primary",
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
    const itemsToRefund = refundItems.filter((item) => item.quantity > 0);
    if (itemsToRefund.length === 0) {
      toast.error("Please select items to refund");
      return;
    }

    try {
      await refundSale({
        id: selectedSale.id,
        data: {
          items: itemsToRefund.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
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
    if (receiptData && isReceiptDialogOpen) {
      openReceiptPrintWindow(receiptData);
      setIsReceiptDialogOpen(false);
    }
  }, [receiptData, isReceiptDialogOpen]);

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
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Sales desk
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-950">
                Sales management
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor invoices, payments, due balances, refunds, and profit from one place.
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/pos">
                <Plus className="mr-2 h-4 w-4" />
                New Sale
              </Link>
            </Button>
          </div>
        </section>

        {/* Summary Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {todayStats.map((stat, index) => (
            <Card key={index} className="border-primary/10 shadow-sm">
              <CardContent className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label.replace(":", "")}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-gray-950">
                    {stat.value}
                  </p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
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
          <Card className="mb-6 border-primary/10 shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-1 border-b border-border p-5">
                <h3 className="text-lg font-semibold text-gray-950">
                  Filter sales
                </h3>
                <p className="text-sm text-gray-500">
                  Narrow results by invoice, date, customer, product, or payment status.
                </p>
              </div>
              <div className="p-5">
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
              </div>
            </CardContent>
          </Card>

          {/* Sales Table */}
          <Card className="border-primary/10 shadow-sm">
            <CardContent className="p-0">
              <div className="p-5 border-b border-border flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-950">
                      Sale List
                    </h3>
                    <p className="text-sm text-gray-500">
                      Real-time invoice records from the backend.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  Total: {total} Sales
                </Badge>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
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
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {sale.discountType === "PERCENTAGE"
                                  ? `${sale.discount}%`
                                  : `৳${sale.discount}`}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatMoney(sale.total)}
                          </TableCell>
                          <TableCell className="text-green-600">
                            {formatMoney(sale.paid)}
                          </TableCell>
                          <TableCell
                            className={
                              sale.due > 0 ? "text-red-600 font-medium" : ""
                            }
                          >
                            {formatMoney(sale.due)}
                          </TableCell>
                          <TableCell
                            className={
                              sale.profit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatMoney(sale.profit)}
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
                                        unitPrice: item.unitPrice,
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
                      {formatMoney(selectedSale.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatMoney(selectedSale.tax)}</span>
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
                    <span>{formatMoney(selectedSale.total)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span>{formatMoney(selectedSale.paid)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Due:</span>
                    <span>{formatMoney(selectedSale.due)}</span>
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
                {formatMoney(selectedSale?.due)}
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
                              existing.quantity = Math.min(
                                item.quantity,
                                Math.max(0, Number(e.target.value)),
                              );
                              existing.unitPrice = item.unitPrice;
                            } else {
                              newItems.push({
                                productId: item.productId,
                                quantity: Math.min(
                                  item.quantity,
                                  Math.max(0, Number(e.target.value)),
                                ),
                                unitPrice: item.unitPrice,
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
                              existing.unitPrice = item.unitPrice;
                            } else {
                              newItems.push({
                                productId: item.productId,
                                quantity: 0,
                                unitPrice: item.unitPrice,
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
        <span className="text-primary font-medium">POS Software</span>. All rights
        reserved.
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Sales;
