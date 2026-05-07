import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Plus, List, FileText, Printer, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PaymentReceiptModal from "@/components/PaymentReceiptModal";
import { useGetCustomersQuery } from "@/redux/api/customerApi";
import { useGetSuppliersQuery } from "@/redux/api/suppliersApi";
import { useCreatePaymentMutation, useDeletePaymentMutation, useGetPaymentsQuery } from "@/redux/api/paymentsApi";

const money = (value: number) => `${Number(value || 0).toLocaleString()} Tk`;

const Payments = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ customerId: "all", supplierId: "all", dateFrom: "", dateTo: "" });
  const [query, setQuery] = useState<any>({ page: 1, limit: 10 });
  const [paymentForm, setPaymentForm] = useState({ date: new Date().toISOString().split("T")[0], paymentFor: "customer", accountId: "", amount: "", paymentMethod: "cash", notes: "" });

  const { data, isLoading, isFetching } = useGetPaymentsQuery(query);
  const { data: customersRes } = useGetCustomersQuery({ page: 1, limit: 100 });
  const { data: suppliersRes } = useGetSuppliersQuery({ page: 1, limit: 100 });
  const [createPayment, { isLoading: saving }] = useCreatePaymentMutation();
  const [deletePayment, { isLoading: deleting }] = useDeletePaymentMutation();

  const payments = data?.data ?? [];
  const meta = data?.meta;
  const customers = customersRes?.data ?? [];
  const suppliers = suppliersRes?.data ?? [];

  const handleReset = () => {
    setFilters({ customerId: "all", supplierId: "all", dateFrom: "", dateTo: "" });
    setPage(1);
    setQuery({ page: 1, limit: 10 });
  };

  const handleFilter = () => {
    setPage(1);
    setQuery({
      page: 1,
      limit: 10,
      customerId: filters.customerId !== "all" ? filters.customerId : undefined,
      supplierId: filters.supplierId !== "all" ? filters.supplierId : undefined,
      startDate: filters.dateFrom || undefined,
      endDate: filters.dateTo || undefined,
    });
  };

  const handleSavePayment = async () => {
    if (!paymentForm.paymentFor || !paymentForm.accountId || !paymentForm.amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      await createPayment({
        amount: Number(paymentForm.amount),
        paymentFor: paymentForm.paymentFor,
        customerId: paymentForm.paymentFor === "customer" ? paymentForm.accountId : undefined,
        supplierId: paymentForm.paymentFor === "supplier" ? paymentForm.accountId : undefined,
        paymentMethod: paymentForm.paymentMethod,
        date: paymentForm.date || undefined,
        notes: paymentForm.notes || undefined,
      }).unwrap();
      setPaymentForm({ date: new Date().toISOString().split("T")[0], paymentFor: "customer", accountId: "", amount: "", paymentMethod: "cash", notes: "" });
      toast({ title: "Success", description: "Payment added successfully" });
      setActiveTab("payments");
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.data?.message || "Could not save payment", variant: "destructive" });
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Delete this payment?")) return;
    await deletePayment(id).unwrap();
    toast({ title: "Deleted", description: "Payment deleted successfully" });
  };

  const accountOptions = paymentForm.paymentFor === "customer" ? customers : suppliers;

  return (
    <DashboardLayout title="Payments">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Payment ledger
            </p>
            <h1 className="text-2xl font-semibold text-gray-950">Payments</h1>
            <p className="text-sm text-gray-500">
              Record customer and supplier payments, print receipts, and track payment history.
            </p>
          </div>
        </section>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger value="payments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"><List className="w-4 h-4 mr-2" />PAYMENTS</TabsTrigger>
            <TabsTrigger value="add" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"><Plus className="w-4 h-4 mr-2" />ADD PAYMENT</TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div><Label>Customer</Label><Select value={filters.customerId} onValueChange={(value) => setFilters({ ...filters, customerId: value })}><SelectTrigger><SelectValue placeholder="Select Customer" /></SelectTrigger><SelectContent><SelectItem value="all">All Customers</SelectItem>{customers.map((item: any) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Supplier</Label><Select value={filters.supplierId} onValueChange={(value) => setFilters({ ...filters, supplierId: value })}><SelectTrigger><SelectValue placeholder="Select Supplier" /></SelectTrigger><SelectContent><SelectItem value="all">All Suppliers</SelectItem>{suppliers.map((item: any) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Start Date</Label><Input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} /></div>
              <div><Label>End Date</Label><Input type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} /></div>
            </div>
            <div className="flex items-center justify-between mb-6"><div className="flex gap-2"><Button size="sm" onClick={handleFilter}>Filter</Button><Button size="sm" variant="secondary" onClick={handleReset}><RotateCcw className="w-3 h-3 mr-1" />Reset</Button></div><Button size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1" />Print</Button></div>

            <div className="space-y-4"><h3 className="text-lg font-medium">Payments History</h3><div className="border rounded-lg overflow-hidden"><Table><TableHeader><TableRow className="bg-primary hover:bg-primary"><TableHead className="text-primary-foreground">SL</TableHead><TableHead className="text-primary-foreground">Details</TableHead><TableHead className="text-primary-foreground">Payment Date</TableHead><TableHead className="text-primary-foreground">Amount</TableHead><TableHead className="text-primary-foreground">Payment Type</TableHead><TableHead className="text-primary-foreground">Method</TableHead><TableHead className="text-primary-foreground">Note</TableHead><TableHead className="text-primary-foreground">#</TableHead></TableRow></TableHeader><TableBody>{isLoading ? <TableRow><TableCell colSpan={8} className="py-10 text-center">Loading...</TableCell></TableRow> : payments.length === 0 ? <TableRow><TableCell colSpan={8} className="py-10 text-center">No payments found</TableCell></TableRow> : payments.map((payment: any, index: number) => <TableRow key={payment.id}><TableCell>{(page - 1) * 10 + index + 1}</TableCell><TableCell><div className="space-y-1"><div>{payment.customer?.name || payment.supplier?.name || "-"}</div><div className="text-sm text-muted-foreground">{payment.customer ? "Customer" : payment.supplier ? "Supplier" : payment.paymentFor}</div></div></TableCell><TableCell>{payment.date ? new Date(payment.date).toLocaleDateString() : payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}</TableCell><TableCell>{money(payment.amount)}</TableCell><TableCell>{payment.paymentFor || "-"}</TableCell><TableCell>{payment.paymentMethod || "-"}</TableCell><TableCell>{payment.notes || payment.note || ""}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" className="h-7 px-3 text-xs" onClick={() => { setSelectedPayment(payment); setReceiptModalOpen(true); }}><FileText className="w-3 h-3 mr-1" />Receipt</Button><Button size="sm" variant="destructive" className="h-7 px-2" disabled={deleting} onClick={() => handleDeletePayment(payment.id)}><Trash2 className="w-3 h-3" /></Button></div></TableCell></TableRow>)}</TableBody></Table></div><div className="flex items-center justify-between mt-4"><p className="text-sm text-muted-foreground">Page {meta?.page ?? page} of {meta?.totalPages ?? 1}{isFetching ? " - Updating..." : ""}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { const next = Math.max(1, page - 1); setPage(next); setQuery((prev: any) => ({ ...prev, page: next })); }}>Previous</Button><Button variant="outline" size="sm" disabled={meta ? page >= meta.totalPages : true} onClick={() => { const next = page + 1; setPage(next); setQuery((prev: any) => ({ ...prev, page: next })); }}>Next</Button></div></div></div>
          </TabsContent>

          <TabsContent value="add" className="mt-0"><Card><CardContent className="p-6"><h3 className="text-lg font-medium mb-6">Create Payment</h3><div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label>Payment Date</Label><Input type="date" value={paymentForm.date} onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })} /></div><div><Label>Payment For*</Label><Select value={paymentForm.paymentFor} onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentFor: value, accountId: "" })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="customer">Customer</SelectItem><SelectItem value="supplier">Supplier</SelectItem></SelectContent></Select></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label>Account*</Label><Select value={paymentForm.accountId} onValueChange={(value) => setPaymentForm({ ...paymentForm, accountId: value })}><SelectTrigger><SelectValue placeholder="Select Account" /></SelectTrigger><SelectContent>{accountOptions.map((item: any) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Amount*</Label><Input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} /></div></div><div><Label>Payment Method</Label><Select value={paymentForm.paymentMethod} onValueChange={(value) => setPaymentForm({ ...paymentForm, paymentMethod: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="mobile_money">Mobile Money</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div><div><Label>Note</Label><Textarea value={paymentForm.notes} onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })} /></div><Button onClick={handleSavePayment} disabled={saving} className="w-full gap-2" size="lg"><CreditCard className="w-4 h-4" />Payment</Button></div></CardContent></Card></TabsContent>
        </Tabs>
      </div>
      <PaymentReceiptModal open={receiptModalOpen} onClose={() => setReceiptModalOpen(false)} payment={selectedPayment} />
    </DashboardLayout>
  );
};

export default Payments;
