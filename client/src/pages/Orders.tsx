import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Search, Eye, Printer, ShoppingCart, Clock, CheckCircle, XCircle } from "lucide-react";

const ordersData = [
  { 
    id: "ORD-001", 
    customer: "Rahman Store", 
    phone: "01711-123456",
    items: 5, 
    total: 12450, 
    status: "Completed", 
    payment: "Cash",
    date: "2026-01-30",
    time: "10:30 AM" 
  },
  { 
    id: "ORD-002", 
    customer: "Karim Traders", 
    phone: "01812-234567",
    items: 8, 
    total: 25800, 
    status: "Pending", 
    payment: "Due",
    date: "2026-01-30",
    time: "11:15 AM" 
  },
  { 
    id: "ORD-003", 
    customer: "Hasan Enterprise", 
    phone: "01913-345678",
    items: 3, 
    total: 8200, 
    status: "Completed", 
    payment: "bKash",
    date: "2026-01-30",
    time: "12:00 PM" 
  },
  { 
    id: "ORD-004", 
    customer: "Alam & Sons", 
    phone: "01614-456789",
    items: 12, 
    total: 45650, 
    status: "Processing", 
    payment: "Card",
    date: "2026-01-30",
    time: "01:45 PM" 
  },
  { 
    id: "ORD-005", 
    customer: "Jabbar Shop", 
    phone: "01515-567890",
    items: 2, 
    total: 3890, 
    status: "Completed", 
    payment: "Cash",
    date: "2026-01-30",
    time: "02:30 PM" 
  },
  { 
    id: "ORD-006", 
    customer: "Molla Variety", 
    phone: "01716-678901",
    items: 6, 
    total: 18500, 
    status: "Cancelled", 
    payment: "-",
    date: "2026-01-29",
    time: "09:20 AM" 
  },
  { 
    id: "ORD-007", 
    customer: "Sikder Mart", 
    phone: "01817-789012",
    items: 15, 
    total: 67800, 
    status: "Completed", 
    payment: "Cash",
    date: "2026-01-29",
    time: "11:45 AM" 
  },
  { 
    id: "ORD-008", 
    customer: "Chowdhury Store", 
    phone: "01918-890123",
    items: 4, 
    total: 9200, 
    status: "Completed", 
    payment: "bKash",
    date: "2026-01-29",
    time: "03:15 PM" 
  },
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    const matchesDate = dateFilter === "all" || order.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

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

  const stats = [
    { title: "Total Orders", value: "342", icon: ShoppingCart, color: "text-primary" },
    { title: "Pending", value: "18", icon: Clock, color: "text-yellow-600" },
    { title: "Completed", value: "298", icon: CheckCircle, color: "text-primary" },
    { title: "Cancelled", value: "26", icon: XCircle, color: "text-destructive" },
  ];

  return (
    <DashboardLayout title="Orders">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2026-01-30">Today</SelectItem>
                  <SelectItem value="2026-01-29">Yesterday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-primary">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.items} items</TableCell>
                  <TableCell className="font-medium">৳{order.total.toLocaleString()}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{order.date}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/orders/${order.id}`}>
                          <Eye className="w-4 h-4" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Printer className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Orders;
