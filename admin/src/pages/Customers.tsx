import { useState } from "react";
import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";
import {
  useDeleteCustomerMutation,
  useGetCustomersQuery,
} from "@/redux/api/customerApi";

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString()}`;

const Customers = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetCustomersQuery({
    page,
    limit,
    search: searchTerm || undefined,
  });
  const [deleteCustomer, { isLoading: deleting }] = useDeleteCustomerMutation();

  const customers = data?.data ?? [];
  const meta = data?.meta;
  const totalCustomers = meta?.total ?? customers.length;

  const stats = [
    { title: "Total Customers", value: totalCustomers.toLocaleString(), icon: Users, change: "From backend" },
    { title: "Current Page", value: customers.length.toString(), icon: UserPlus, change: "Visible records" },
    { title: "Opening Balance", value: money(customers.reduce((sum: number, item: any) => sum + Number(item.openingBalance || 0), 0)), icon: ShoppingBag, change: "Visible page" },
    { title: "Due Balance", value: money(customers.reduce((sum: number, item: any) => sum + Number(item.due || 0), 0)), icon: TrendingUp, change: "Visible page" },
  ];

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id).unwrap();
      toast({ title: "Deleted", description: "Customer deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.data?.message || "Could not delete customer",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Customers">
      <div className="space-y-6">
      <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Customer accounts
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-950">
              Customers
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage customer profiles, opening balances, dues, and contact details.
            </p>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/customers/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-primary/10 shadow-sm">
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
      <Card className="border-primary/10 shadow-sm">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>All Customers</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {isFetching ? "Updating..." : `${totalCustomers} backend records`}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button asChild>
                <Link href="/customers/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Link>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : customers.map((customer: any) => (
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
                  <TableCell className="text-muted-foreground">{customer.phone || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.email || "-"}</TableCell>
                  <TableCell>{customer.orderCount ?? customer.orders ?? 0}</TableCell>
                  <TableCell className="font-medium">{money(customer.totalSpent ?? customer.openingBalance ?? 0)}</TableCell>
                  <TableCell className="text-muted-foreground">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Edit screen coming soon" disabled>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" disabled={deleting} onClick={() => handleDelete(customer.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {meta?.page ?? page} of {meta?.totalPage ?? meta?.totalPages ?? 1}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= (meta?.totalPage ?? meta?.totalPages ?? 1)} onClick={() => setPage((prev) => prev + 1)}>
            Next
          </Button>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
