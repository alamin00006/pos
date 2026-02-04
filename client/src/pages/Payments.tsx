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
import { CreditCard, Trash2, Plus, List, FileText, Printer, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import PaymentReceiptModal from "@/components/PaymentReceiptModal";

interface Payment {
  id: number;
  walletDirect: string;
  date: string;
  paymentType: string;
  accountType: string;
  accountName: string;
  phone: string;
  amount: number;
  note: string;
}

const Payments = () => {
  const [activeTab, setActiveTab] = useState("payments");
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    walletDirect: "No",
    date: new Date().toISOString().split("T")[0],
    paymentType: "",
    accountType: "",
    accountId: "",
    amount: "",
    transactionAccount: "",
    note: "",
  });

  // Mock data
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      walletDirect: "No",
      date: "24 Jan, 2026",
      paymentType: "Cash Received",
      accountType: "Customer",
      accountName: "Walk In Customer",
      phone: "",
      amount: 4500,
      note: "",
    },
    {
      id: 2,
      walletDirect: "No",
      date: "23 Jan, 2026",
      paymentType: "Cash Received",
      accountType: "Customer",
      accountName: "Walk In Customer",
      phone: "",
      amount: 4500,
      note: "",
    },
    {
      id: 3,
      walletDirect: "No",
      date: "19 Jan, 2026",
      paymentType: "Cash Pay",
      accountType: "Supplier",
      accountName: "Default Supplier",
      phone: "111111",
      amount: 11205,
      note: "",
    },
    {
      id: 4,
      walletDirect: "No",
      date: "15 Jan, 2026",
      paymentType: "Cash Received",
      accountType: "Customer",
      accountName: "dsd",
      phone: "325",
      amount: 83258,
      note: "",
    },
    {
      id: 5,
      walletDirect: "No",
      date: "15 Jan, 2026",
      paymentType: "Cash Received",
      accountType: "Customer",
      accountName: "Md Sumon",
      phone: "01847899745",
      amount: 431,
      note: "Personal",
    },
    {
      id: 6,
      walletDirect: "No",
      date: "19 Dec, 2025",
      paymentType: "Cash Received",
      accountType: "Customer",
      accountName: "Walk In Customer",
      phone: "",
      amount: 96200,
      note: "",
    },
    {
      id: 7,
      walletDirect: "No",
      date: "09 Dec, 2025",
      paymentType: "Cash Pay",
      accountType: "Supplier",
      accountName: "Default Supplier",
      phone: "111111",
      amount: 3190000,
      note: "",
    },
  ]);

  // Filters
  const [filters, setFilters] = useState({
    customer: "",
    supplier: "",
    dateFrom: "",
    dateTo: "",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleFormChange = (field: string, value: string) => {
    setPaymentForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePayment = () => {
    if (!paymentForm.date || !paymentForm.paymentType || !paymentForm.accountType || !paymentForm.amount) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newPayment: Payment = {
      id: payments.length + 1,
      walletDirect: paymentForm.walletDirect,
      date: paymentForm.date,
      paymentType: paymentForm.paymentType === "Customer" ? "Cash Received" : "Cash Pay",
      accountType: paymentForm.accountType,
      accountName: paymentForm.accountId,
      phone: "",
      amount: parseFloat(paymentForm.amount),
      note: paymentForm.note,
    };

    setPayments([...payments, newPayment]);
    setPaymentForm({
      walletDirect: "No",
      date: new Date().toISOString().split("T")[0],
      paymentType: "",
      accountType: "",
      accountId: "",
      amount: "",
      transactionAccount: "",
      note: "",
    });
    toast({
      title: "Success",
      description: "Payment added successfully",
    });
    setActiveTab("payments");
  };

  const handleDeletePayment = (id: number) => {
    setPayments(payments.filter((p) => p.id !== id));
    toast({
      title: "Deleted",
      description: "Payment deleted successfully",
    });
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesCustomer = !filters.customer || (payment.accountType === "Customer" && payment.accountName.toLowerCase().includes(filters.customer.toLowerCase()));
    const matchesSupplier = !filters.supplier || (payment.accountType === "Supplier" && payment.accountName.toLowerCase().includes(filters.supplier.toLowerCase()));
    return (filters.customer ? matchesCustomer : true) && (filters.supplier ? matchesSupplier : true);
  });

  const handleReset = () => {
    setFilters({
      customer: "",
      supplier: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Pagination logic
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  return (
    <DashboardLayout title="Add Payment">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger
              value="payments"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              <List className="w-4 h-4 mr-2" />
              PAYMENTS
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD PAYMENT
            </TabsTrigger>
          </TabsList>

          {/* Payments List Tab */}
          <TabsContent value="payments" className="mt-0">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label className="text-muted-foreground text-sm">Customer</Label>
                <Select
                  value={filters.customer}
                  onValueChange={(value) =>
                    setFilters({ ...filters, customer: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walk-in">Walk In Customer</SelectItem>
                    <SelectItem value="md-sumon">Md Sumon</SelectItem>
                    <SelectItem value="dsd">dsd</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Supplier</Label>
                <Select
                  value={filters.supplier}
                  onValueChange={(value) =>
                    setFilters({ ...filters, supplier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Start Date</Label>
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">End Date</Label>
                <Input
                  type="date"
                  placeholder="End Date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button size="sm" className="gap-1">
                  Filter
                </Button>
                <Button size="sm" variant="default" onClick={handleReset} className="gap-1">
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
              </div>
              <Button size="sm" className="gap-1">
                <Printer className="w-4 h-4" />
                Print
              </Button>
            </div>

            {/* Payments History */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payments History</h3>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary hover:bg-primary">
                      <TableHead className="text-primary-foreground font-semibold w-12">SL</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Details</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Payment Date</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Amount</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Payment Type</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Wallet Payment</TableHead>
                      <TableHead className="text-primary-foreground font-semibold">Note</TableHead>
                      <TableHead className="text-primary-foreground font-semibold w-32">#</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedPayments.map((payment, index) => (
                        <TableRow key={payment.id} className="border-b">
                          <TableCell className="font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex gap-2">
                                <span className="text-muted-foreground text-sm">{payment.accountType} Name:</span>
                                <span className="text-sm">{payment.accountName}</span>
                              </div>
                              {payment.phone && (
                                <div className="flex gap-2">
                                  <span className="text-muted-foreground text-sm">Phone:</span>
                                  <span className="text-sm">{payment.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{payment.date}</TableCell>
                          <TableCell>{payment.amount.toLocaleString()} Tk</TableCell>
                          <TableCell>{payment.paymentType}</TableCell>
                          <TableCell>{payment.walletDirect === "Yes" ? "Yes" : "NO"}</TableCell>
                          <TableCell>{payment.note || ""}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="h-7 px-3 text-xs gap-1"
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setReceiptModalOpen(true);
                                }}
                              >
                                <FileText className="w-3 h-3" />
                                Receipt
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                className="h-7 px-3 text-xs"
                                onClick={() => handleDeletePayment(payment.id)}
                              >
                                Delete
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
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{" "}
                  {filteredPayments.length} entries
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Add Payment Tab */}
          <TabsContent value="add" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-6">Create Payment</h3>
                <div className="space-y-6">
                  {/* Wallet/Direct Transaction */}
                  <div>
                    <Label>Wallet/Direct Transaction</Label>
                    <Select
                      value={paymentForm.walletDirect}
                      onValueChange={(value) => handleFormChange("walletDirect", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Date & Payment Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>
                        Payment Date<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={paymentForm.date}
                        onChange={(e) => handleFormChange("date", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>
                        Payment Type<span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={paymentForm.paymentType}
                        onValueChange={(value) => handleFormChange("paymentType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Supplier">Supplier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Account Type & Account ID */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>
                        Account Type<span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={paymentForm.accountType}
                        onValueChange={(value) => handleFormChange("accountType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="Supplier">Supplier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        Account ID<span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={paymentForm.accountId}
                        onValueChange={(value) => handleFormChange("accountId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C001">C001 - John Doe</SelectItem>
                          <SelectItem value="C002">C002 - Jane Smith</SelectItem>
                          <SelectItem value="S001">S001 - Supplier A</SelectItem>
                          <SelectItem value="S002">S002 - Supplier B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Amount & Transaction Account */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>
                        Amount<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="Enter Amount"
                        value={paymentForm.amount}
                        onChange={(e) => handleFormChange("amount", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Transaction Account</Label>
                      <Select
                        value={paymentForm.transactionAccount}
                        onValueChange={(value) => handleFormChange("transactionAccount", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">CASH</SelectItem>
                          <SelectItem value="BANK">BANK</SelectItem>
                          <SelectItem value="MOBILE_BANKING">MOBILE BANKING</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <Label>Note</Label>
                    <Textarea
                      placeholder="Write Note. (optional)"
                      value={paymentForm.note}
                      onChange={(e) => handleFormChange("note", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button onClick={handleSavePayment} className="w-full gap-2" size="lg">
                    <CreditCard className="w-4 h-4" />
                    Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Receipt Modal */}
      <PaymentReceiptModal
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        payment={selectedPayment}
      />
    </DashboardLayout>
  );
};

export default Payments;
