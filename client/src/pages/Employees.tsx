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

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  joiningDate: string;
  salary: number;
  overtimeRate: number;
  status: "Active" | "Inactive";
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Mohammad Rahman",
    email: "rahman@example.com",
    phone: "01712345678",
    address: "123 Main Street, Dhaka",
    joiningDate: "2024-01-15",
    salary: 25000,
    overtimeRate: 200,
    status: "Active",
  },
  {
    id: 2,
    name: "Fatima Begum",
    email: "fatima@example.com",
    phone: "01898765432",
    address: "456 Commercial Road, Chittagong",
    joiningDate: "2024-03-01",
    salary: 30000,
    overtimeRate: 250,
    status: "Active",
  },
  {
    id: 3,
    name: "Kamal Hossain",
    email: "kamal@example.com",
    phone: "01556677889",
    address: "789 Industrial Area, Sylhet",
    joiningDate: "2023-06-20",
    salary: 35000,
    overtimeRate: 300,
    status: "Inactive",
  },
];

const Employees = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    joiningDate: new Date().toISOString().split('T')[0],
    name: "",
    email: "",
    phone: "",
    salary: "",
    overtimeRate: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.salary || !formData.overtimeRate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Employee added successfully!",
    });
    setFormData({
      joiningDate: new Date().toISOString().split('T')[0],
      name: "",
      email: "",
      phone: "",
      salary: "",
      overtimeRate: "",
      address: "",
    });
    setActiveTab("list");
  };

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">New Employee</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger
              value="list"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              EMPLOYEES
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              + NEW EMPLOYEE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-primary mb-6">New Employee</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">
                        Joining Date<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) =>
                          setFormData({ ...formData, joiningDate: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Name<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter Customer Name..."
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
                        placeholder="Enter Customer Email..."
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        placeholder="Enter Customer Phone..."
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">
                        Salary<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="salary"
                        type="number"
                        placeholder=""
                        value={formData.salary}
                        onChange={(e) =>
                          setFormData({ ...formData, salary: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overtimeRate">
                        Overtime Rate<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="overtimeRate"
                        type="number"
                        placeholder="Must be write 0"
                        value={formData.overtimeRate}
                        onChange={(e) =>
                          setFormData({ ...formData, overtimeRate: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Write Address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows={3}
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
                        <TableHead className="text-primary-foreground font-semibold">Joining Date</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Salary</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Overtime Rate</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockEmployees.map((employee, index) => (
                        <TableRow key={employee.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">Phone: {employee.phone}</p>
                              <p className="text-sm text-muted-foreground">Email: {employee.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                          <TableCell>৳ {employee.salary.toLocaleString()}</TableCell>
                          <TableCell>৳ {employee.overtimeRate.toLocaleString()}/hr</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              employee.status === "Active" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {employee.status}
                            </span>
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
                    Showing 1 to {mockEmployees.length} of {mockEmployees.length} entries
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

export default Employees;
