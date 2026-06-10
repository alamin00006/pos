"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  UserPlus,
  Users,
  Phone,
  X,
  Check,
  ShoppingBag,
  Package,
  History,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetProductsQuery,
  useSearchProductsQuery,
} from "@/redux/api/productsApi";
import { useGetCategoriesQuery } from "@/redux/api/categoriesApi";
import { useCreateSaleMutation } from "@/redux/api/salesApi";
import { useGetBankAccountsQuery } from "@/redux/api/bankAccountsApi";

import toast from "react-hot-toast";
import {
  useCreateCustomerMutation,
  useGetCustomerLedgerQuery,
  useGetCustomersQuery,
  useMakeCustomerPaymentMutation,
} from "@/redux/api/customerApi";

interface CartItem {
  id: string;
  name: string;
  sellPrice: number;
  quantity: number;
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  due?: number;
}

const POS = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isLedgerDialogOpen, setIsLedgerDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [bankAccountId, setBankAccountId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [note, setNote] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");

  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    openingBalance: 0,
  });

  // Payment form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNote, setPaymentNote] = useState("");

  // API Hooks
  const [createSale, { isLoading: isSaving }] = useCreateSaleMutation();
  const [createCustomer, { isLoading: isCreatingCustomer }] =
    useCreateCustomerMutation();
  const [makePayment, { isLoading: isMakingPayment }] =
    useMakeCustomerPaymentMutation();

  // Data fetching
  const { data: productsData, isLoading } = useGetProductsQuery({
    page: 1,
    limit: 50,
    categoryId: selectedCategory,
  }) as any;

  const { data: searchData } = useSearchProductsQuery(
    { q: searchTerm },
    { skip: !searchTerm },
  );

  const { data: categoriesData } = useGetCategoriesQuery({
    page: 1,
    limit: 50,
  }) as any;
  const { data: bankAccountsData } = useGetBankAccountsQuery({
    page: 1,
    limit: 100,
  });

  const { data: customersData, refetch: refetchCustomers } =
    useGetCustomersQuery({
      page: 1,
      limit: 50,
      search: customerSearch || undefined,
    });

  const { data: ledgerData } = useGetCustomerLedgerQuery(
    { id: selectedCustomer?.id || "", params: { page: 1, limit: 10 } },
    { skip: !selectedCustomer?.id || !isLedgerDialogOpen },
  );

  const products = searchTerm
    ? searchData?.data || []
    : productsData?.data || [];
  const categories = categoriesData?.data || [];
  const customers = customersData?.data || [];
  const bankAccounts = bankAccountsData?.data || [];

  // Cart calculations
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sellPrice: Number(product.sellPrice),
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const subtotal = cart.reduce((s, i) => s + i.sellPrice * i.quantity, 0);
  const tax = subtotal * 0.05;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + tax - discountAmount;

  // Customer functions
  const handleAddCustomer = async () => {
    if (!newCustomer.name) {
      toast.error("Customer name is required");
      return;
    }

    try {
      const result = await createCustomer({
        ...newCustomer,
        openingBalance: Number(newCustomer.openingBalance) || 0,
      }).unwrap();

      toast.success("Customer added successfully");
      setSelectedCustomer(result);
      setIsAddCustomerDialogOpen(false);
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        openingBalance: 0,
      });
      refetchCustomers();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to add customer");
    }
  };

  const handleMakePayment = async () => {
    if (!selectedCustomer) return;
    if (!paymentAmount || paymentAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await makePayment({
        id: selectedCustomer.id,
        data: {
          amount: paymentAmount,
          paymentMethod: paymentMethod,
          note: paymentNote || "Payment received",
          paymentDate: new Date(),
        },
      }).unwrap();

      toast.success("Payment recorded successfully");
      setIsPaymentDialogOpen(false);
      setPaymentAmount(0);
      setPaymentNote("");
      refetchCustomers();
    } catch (err: any) {
      toast.error(err?.data?.message || "Payment failed");
    }
  };

  // Checkout
  const handleCheckout = async () => {
    if (!cart.length) return;
    if (paymentMethod !== "CASH" && !bankAccountId) {
      toast.error("Please select a bank account for non-cash payment");
      return;
    }

    try {
      const selectedBankAccountId =
        paymentMethod !== "CASH" ? bankAccountId : undefined;
      const payload = {
        paymentMethod,
        bankAccountId: selectedBankAccountId,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.sellPrice,
          discount: 0,
        })),
        tax,
        discount: discountAmount,
        note: note || "POS Sale",
        customerId: selectedCustomer?.id,
        payments: [
          {
            amount: total,
            paymentMethod,
            bankAccountId: selectedBankAccountId,
          },
        ],
      };

      await createSale(payload).unwrap();

      toast.success("Sale Completed");
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setBankAccountId("");
      setNote("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Sale Failed ");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout title="Point of Sale">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
                Checkout counter
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-950">
                Point of Sale
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Add products, manage customers, collect payment, and complete the sale quickly.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-lg border border-primary/10 bg-primary/5 p-3 text-center">
              <div>
                <p className="text-xs text-gray-500">Items</p>
                <p className="text-lg font-semibold text-gray-950">{cart.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="max-w-28 truncate text-lg font-semibold text-gray-950">
                  {selectedCustomer?.name || "Walk-in"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-lg font-semibold text-primary">
                  Tk {total.toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        </section>

      <div className="flex flex-col gap-6 xl:flex-row xl:h-[calc(100vh-14rem)]">
        {/* Products Section */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-primary/10">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-950">Products</h2>
                  <p className="text-sm text-gray-500">Search inventory and tap to add.</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {products.length} items
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={!selectedCategory ? "default" : "outline"}
                    onClick={() => setSelectedCategory(undefined)}
                    className={
                      !selectedCategory ? "bg-primary hover:bg-primary/90" : ""
                    }
                  >
                    <Package className="w-4 h-4 mr-2" />
                    All
                  </Button>

                  {categories.map((c: any) => (
                    <Button
                      key={c.id}
                      size="sm"
                      variant={
                        selectedCategory === c.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedCategory(c.id)}
                      className={
                        selectedCategory === c.id
                          ? "bg-primary hover:bg-primary/90"
                          : ""
                      }
                    >
                      {c.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p: any) => (
                  <Card
                    key={p.id}
                    className="cursor-pointer border-primary/10 hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
                    onClick={() => addToCart(p)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-square bg-primary/10 rounded-md mb-3 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        ৳{p.sellPrice}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Cart & Customer Section */}
        <Card className="w-full xl:w-96 flex flex-col shadow-sm border-primary/10">
          {/* Customer Section */}
          <div className="p-4 border-b border-gray-100 bg-primary/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Customer
              </h3>
              <div className="flex gap-1">
                {selectedCustomer && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-primary"
                      onClick={() => setIsLedgerDialogOpen(true)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-green-600"
                      onClick={() => {
                        setPaymentAmount(selectedCustomer.due || 0);
                        setIsPaymentDialogOpen(true);
                      }}
                    >
                      <Wallet className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Dialog
                  open={isAddCustomerDialogOpen}
                  onOpenChange={setIsAddCustomerDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Customer</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={newCustomer.name}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              name: e.target.value,
                            })
                          }
                          placeholder="Customer name"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newCustomer.email}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              email: e.target.value,
                            })
                          }
                          placeholder="customer@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={newCustomer.phone}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              phone: e.target.value,
                            })
                          }
                          placeholder="Phone number"
                        />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input
                          value={newCustomer.address}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              address: e.target.value,
                            })
                          }
                          placeholder="Customer address"
                        />
                      </div>
                      <div>
                        <Label>Opening Balance</Label>
                        <Input
                          type="number"
                          value={newCustomer.openingBalance}
                          onChange={(e) =>
                            setNewCustomer({
                              ...newCustomer,
                              openingBalance: Number(e.target.value),
                            })
                          }
                          placeholder="0"
                        />
                      </div>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={handleAddCustomer}
                        disabled={isCreatingCustomer}
                      >
                        {isCreatingCustomer ? "Adding..." : "Add Customer"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Dialog
              open={isCustomerDialogOpen}
              onOpenChange={setIsCustomerDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-dashed"
                >
                  {selectedCustomer ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(selectedCustomer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {selectedCustomer.name}
                        </span>
                      </div>
                      {selectedCustomer.due ? (
                        <Badge variant="destructive" className="text-xs">
                          Due: ৳{selectedCustomer.due}
                        </Badge>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Select customer
                      </span>
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Customer</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    placeholder="Search customers..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                  />
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {customers.map((customer: Customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer border"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsCustomerDialogOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(customer.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{customer.name}</p>
                              {customer.phone && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {customer.phone}
                                </p>
                              )}
                            </div>
                          </div>
                          {customer.due ? (
                            <Badge variant="destructive">৳{customer.due}</Badge>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Separator />

          {/* Cart Items */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Cart Items</h3>
                <Badge variant="outline" className="bg-white">
                  {cart.length} items
                </Badge>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Cart is empty</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ৳{item.sellPrice}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="h-7 w-7"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="h-7 w-7"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="h-7 w-7 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </div>

          {/* Order Summary */}
          <div className="p-4 border-t bg-gray-50">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (5%)</span>
                  <span className="font-medium">৳{tax.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-16 h-7 text-sm"
                      placeholder="%"
                    />
                    <span className="text-sm font-medium text-green-600">
                      -৳{discountAmount.toFixed(0)}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ৳{total.toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === "CASH" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("CASH")}
                  className={paymentMethod === "CASH" ? "bg-primary" : ""}
                >
                  <Banknote className="w-4 h-4" />
                </Button>
                <Button
                  variant={paymentMethod === "CARD" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("CARD")}
                  className={paymentMethod === "CARD" ? "bg-primary" : ""}
                >
                  <CreditCard className="w-4 h-4" />
                </Button>
                <Button
                  variant={paymentMethod === "BKASH" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("BKASH")}
                  className={paymentMethod === "BKASH" ? "bg-primary" : ""}
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>

              {paymentMethod !== "CASH" && (
                <Select value={bankAccountId} onValueChange={setBankAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank account" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankAccounts.map((account: any) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountName || account.bankName || account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button
                className="w-full bg-primary hover:bg-primary/90 h-12"
                onClick={handleCheckout}
                disabled={!cart.length || isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Complete Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Customer</Label>
              <p className="text-sm font-medium mt-1">
                {selectedCustomer?.name}
              </p>
            </div>
            <div>
              <Label>Current Due</Label>
              <p className="text-lg font-bold text-red-600">
                ৳{selectedCustomer?.due || 0}
              </p>
            </div>
            <div>
              <Label>Payment Amount</Label>
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
                  <SelectItem value="BANK">Bank</SelectItem>
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
              onClick={handleMakePayment}
              disabled={isMakingPayment}
            >
              {isMakingPayment ? "Processing..." : "Receive Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ledger Dialog */}
      <Dialog open={isLedgerDialogOpen} onOpenChange={setIsLedgerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Customer Ledger - {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Due</Label>
                  <p className="text-xl font-bold text-red-600">
                    ৳{selectedCustomer?.due || 0}
                  </p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm">{selectedCustomer?.phone || "N/A"}</p>
                </div>
              </div>
            </div>
            <ScrollArea className="h-96">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">
                      Date
                    </th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">
                      Type
                    </th>
                    <th className="text-right p-2 text-xs font-medium text-gray-500">
                      Amount
                    </th>
                    <th className="text-right p-2 text-xs font-medium text-gray-500">
                      Balance
                    </th>
                    <th className="text-left p-2 text-xs font-medium text-gray-500">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ledgerData?.data?.map((entry: any) => (
                    <tr key={entry.id} className="border-b">
                      <td className="p-2 text-sm">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-sm">
                        <Badge>{entry.type}</Badge>
                      </td>
                      <td className="p-2 text-sm text-right">
                        ৳{entry.amount}
                      </td>
                      <td className="p-2 text-sm text-right font-medium">
                        ৳{entry.balance}
                      </td>
                      <td className="p-2 text-sm">{entry.note || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default POS;
