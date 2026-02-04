import { useState } from "react";
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
import { Save, MoreHorizontal, Eye, Pencil, Trash2, Printer } from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  openingReceivable: number;
  openingPayable: number;
  totalPurchase: number;
  totalPaid: number;
  due: number;
}

const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "ABC Suppliers Ltd",
    email: "abc@suppliers.com",
    phone: "01712345678",
    address: "123 Main Street, Dhaka",
    openingReceivable: 5000,
    openingPayable: 0,
    totalPurchase: 150000,
    totalPaid: 145000,
    due: 5000,
  },
  {
    id: 2,
    name: "XYZ Trading",
    email: "xyz@trading.com",
    phone: "01898765432",
    address: "456 Commercial Road, Chittagong",
    openingReceivable: 0,
    openingPayable: 10000,
    totalPurchase: 250000,
    totalPaid: 240000,
    due: 10000,
  },
  {
    id: 3,
    name: "Global Imports",
    email: "global@imports.com",
    phone: "01556677889",
    address: "789 Industrial Area, Sylhet",
    openingReceivable: 0,
    openingPayable: 0,
    totalPurchase: 500000,
    totalPaid: 500000,
    due: 0,
  },
];

const Suppliers = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    openingReceivable: "",
    openingPayable: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
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

  return (
    <DashboardLayout title="Suppliers">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">New Supplier</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
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

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-primary mb-6">New Supplier</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Supplier Name<span className="text-destructive">*</span>
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

                    <div className="space-y-2">
                      <Label htmlFor="openingReceivable">Opening Receivable</Label>
                      <Input
                        id="openingReceivable"
                        type="number"
                        placeholder="0"
                        value={formData.openingReceivable}
                        onChange={(e) =>
                          setFormData({ ...formData, openingReceivable: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingPayable">Opening Payable</Label>
                      <Input
                        id="openingPayable"
                        type="number"
                        placeholder="0"
                        value={formData.openingPayable}
                        onChange={(e) =>
                          setFormData({ ...formData, openingPayable: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit" className="bg-primary hover:bg-primary/90 gap-2">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <select className="border border-border rounded px-2 py-1 text-sm bg-background">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                    <span className="text-sm text-muted-foreground">entries</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                      <Printer className="w-4 h-4" />
                      Print
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Search:</span>
                      <Input placeholder="Search..." className="w-48 h-9" />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-primary hover:bg-primary">
                        <TableHead className="text-primary-foreground font-semibold">SL</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Details</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Total Purchase</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Total Paid</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Due</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSuppliers.map((supplier, index) => (
                        <TableRow key={supplier.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{supplier.name}</p>
                              <p className="text-sm text-muted-foreground">Phone: {supplier.phone}</p>
                              <p className="text-sm text-muted-foreground">Email: {supplier.email}</p>
                              <p className="text-sm text-muted-foreground">Address: {supplier.address}</p>
                            </div>
                          </TableCell>
                          <TableCell>৳ {supplier.totalPurchase.toLocaleString()}</TableCell>
                          <TableCell>৳ {supplier.totalPaid.toLocaleString()}</TableCell>
                          <TableCell className={supplier.due > 0 ? "text-destructive font-medium" : ""}>
                            ৳ {supplier.due.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover">
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Eye className="w-4 h-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Pencil className="w-4 h-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing 1 to {mockSuppliers.length} of {mockSuppliers.length} entries
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="default" size="sm" className="bg-primary">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
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
