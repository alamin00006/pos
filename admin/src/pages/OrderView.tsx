"use client";

import { useRRParams, useNavigate } from "@/lib/router";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Printer, Download, User, MapPin, Phone, Mail } from "lucide-react";

// Demo order data
const orderDetails = {
  id: "ORD-001",
  date: "2026-01-30",
  time: "10:30 AM",
  status: "Completed",
  paymentMethod: "Cash",
  paymentStatus: "Paid",
  customer: {
    name: "Rahman Store",
    phone: "01711-123456",
    email: "rahman@store.com",
    address: "123 Market Street, Dhanmondi, Dhaka",
  },
  items: [
    { id: 1, name: "Rice (50kg)", sku: "GRO-001", quantity: 2, price: 2500, total: 5000 },
    { id: 2, name: "Oil (5L)", sku: "GRO-003", quantity: 3, price: 850, total: 2550 },
    { id: 3, name: "Sugar (1kg)", sku: "GRO-002", quantity: 10, price: 100, total: 1000 },
    { id: 4, name: "Flour (2kg)", sku: "GRO-004", quantity: 5, price: 120, total: 600 },
    { id: 5, name: "Salt (1kg)", sku: "GRO-005", quantity: 20, price: 35, total: 700 },
  ],
  subtotal: 9850,
  tax: 493,
  discount: 0,
  total: 10343,
  notes: "Customer requested delivery before noon.",
};

const OrderView = () => {
  const { orderId } = useRRParams();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{status}</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">{status}</Badge>;
      case "Processing":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">{status}</Badge>;
      case "Cancelled":
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout title={`Order ${orderId || orderDetails.id}`}>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate("/orders")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button>
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <Card>
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order Details</CardTitle>
                  {getStatusBadge(orderDetails.status)}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-semibold text-primary">{orderDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{orderDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{orderDetails.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment</p>
                    <p className="font-medium">{orderDetails.paymentMethod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.sku}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">৳{item.price}</TableCell>
                        <TableCell className="text-right font-medium">৳{item.total.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Notes */}
            {orderDetails.notes && (
              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg">Notes</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{orderDetails.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="font-semibold text-lg">{orderDetails.customer.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{orderDetails.customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{orderDetails.customer.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{orderDetails.customer.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>৳{orderDetails.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>৳{orderDetails.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>৳{orderDetails.discount}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">৳{orderDetails.total.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge className="bg-primary/10 text-primary">{orderDetails.paymentStatus}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-medium">{orderDetails.paymentMethod}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderView;
