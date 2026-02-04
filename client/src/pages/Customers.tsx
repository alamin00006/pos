import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Users, UserPlus, ShoppingBag, TrendingUp } from "lucide-react";

const customersData = [
  { id: 1, name: "Rahman Store", phone: "01711-123456", email: "rahman@store.com", orders: 156, totalSpent: 245000, lastOrder: "2 hours ago" },
  { id: 2, name: "Karim Traders", phone: "01812-234567", email: "karim@traders.com", orders: 89, totalSpent: 178500, lastOrder: "5 hours ago" },
  { id: 3, name: "Hasan Enterprise", phone: "01913-345678", email: "hasan@enterprise.com", orders: 234, totalSpent: 456000, lastOrder: "1 day ago" },
  { id: 4, name: "Alam & Sons", phone: "01614-456789", email: "alam@sons.com", orders: 67, totalSpent: 89000, lastOrder: "2 days ago" },
  { id: 5, name: "Jabbar Shop", phone: "01515-567890", email: "jabbar@shop.com", orders: 45, totalSpent: 56000, lastOrder: "3 days ago" },
  { id: 6, name: "Molla Variety", phone: "01716-678901", email: "molla@variety.com", orders: 123, totalSpent: 198000, lastOrder: "4 hours ago" },
  { id: 7, name: "Sikder Mart", phone: "01817-789012", email: "sikder@mart.com", orders: 78, totalSpent: 134500, lastOrder: "6 hours ago" },
  { id: 8, name: "Chowdhury Store", phone: "01918-890123", email: "chowdhury@store.com", orders: 201, totalSpent: 378000, lastOrder: "8 hours ago" },
];

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { title: "Total Customers", value: "892", icon: Users, change: "+12 this month" },
    { title: "New Customers", value: "45", icon: UserPlus, change: "This month" },
    { title: "Total Orders", value: "3,456", icon: ShoppingBag, change: "+8.5% growth" },
    { title: "Avg. Order Value", value: "৳2,850", icon: TrendingUp, change: "+5.2% growth" },
  ];

  return (
    <DashboardLayout title="Customers">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button asChild>
                <a href="/customers/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                  <TableCell>{customer.orders}</TableCell>
                  <TableCell className="font-medium">৳{customer.totalSpent.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.lastOrder}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

export default Customers;
