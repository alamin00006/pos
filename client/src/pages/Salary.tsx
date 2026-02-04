import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  salary: number;
  overtimeRate: number;
}

interface SalaryRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  salaryMonth: string;
  basicSalary: number;
  overtimeRate: number;
  totalOvertime: number;
  totalSalary: number;
  advanceAmount: number;
  payAmount: number;
  transactionAccount: string;
  status: "Paid" | "Pending";
}

const mockEmployees: Employee[] = [
  { id: 1, name: "Mohammad Rahman", salary: 25000, overtimeRate: 200 },
  { id: 2, name: "Fatima Begum", salary: 30000, overtimeRate: 250 },
  { id: 3, name: "Kamal Hossain", salary: 35000, overtimeRate: 300 },
];

const mockSalaryRecords: SalaryRecord[] = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Mohammad Rahman",
    salaryMonth: "2026-01",
    basicSalary: 25000,
    overtimeRate: 200,
    totalOvertime: 10,
    totalSalary: 27000,
    advanceAmount: 5000,
    payAmount: 22000,
    transactionAccount: "CASH",
    status: "Paid",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Fatima Begum",
    salaryMonth: "2026-01",
    basicSalary: 30000,
    overtimeRate: 250,
    totalOvertime: 5,
    totalSalary: 31250,
    advanceAmount: 0,
    payAmount: 31250,
    transactionAccount: "CASH",
    status: "Paid",
  },
];

const Salary = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    salaryMonth: new Date().toISOString().split('T')[0],
    employeeId: "",
    basicSalary: "",
    overtimeRate: "",
    totalOvertime: "",
    totalSalary: "",
    advanceAmount: "0",
    payAmount: "",
    transactionAccount: "CASH",
  });

  const selectedEmployee = mockEmployees.find(e => e.id.toString() === formData.employeeId);

  useEffect(() => {
    if (selectedEmployee) {
      const basicSalary = selectedEmployee.salary;
      const overtimeRate = selectedEmployee.overtimeRate;
      const totalOvertime = parseFloat(formData.totalOvertime) || 0;
      const overtimePay = overtimeRate * totalOvertime;
      const totalSalary = basicSalary + overtimePay;
      const advanceAmount = parseFloat(formData.advanceAmount) || 0;
      const payAmount = totalSalary - advanceAmount;

      setFormData(prev => ({
        ...prev,
        basicSalary: basicSalary.toString(),
        overtimeRate: overtimeRate.toString(),
        totalSalary: totalSalary.toString(),
        payAmount: payAmount.toString(),
      }));
    }
  }, [formData.employeeId, formData.totalOvertime, formData.advanceAmount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.salaryMonth) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Salary added successfully!",
    });
    setFormData({
      salaryMonth: new Date().toISOString().split('T')[0],
      employeeId: "",
      basicSalary: "",
      overtimeRate: "",
      totalOvertime: "",
      totalSalary: "",
      advanceAmount: "0",
      payAmount: "",
      transactionAccount: "CASH",
    });
    setActiveTab("list");
  };

  return (
    <DashboardLayout title="Salary">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">New Employee Salary</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger
              value="list"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              EMPLOYEES SALARY
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              + NEW EMPLOYEE SALARY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-primary mb-6">Employee Salary</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMonth">
                        Salary Month<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="salaryMonth"
                        type="date"
                        value={formData.salaryMonth}
                        onChange={(e) =>
                          setFormData({ ...formData, salaryMonth: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employee">
                        Employee<span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.employeeId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, employeeId: value })
                        }
                      >
                        <SelectTrigger className="border-primary/30 focus:border-primary">
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {mockEmployees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="basicSalary">
                        Basic Salary<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="basicSalary"
                        type="number"
                        value={formData.basicSalary}
                        readOnly
                        className="bg-primary/10 border-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overtimeRate">Overtime Rate</Label>
                      <Input
                        id="overtimeRate"
                        type="number"
                        value={formData.overtimeRate}
                        readOnly
                        className="bg-primary/10 border-primary/30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalOvertime">Total Overtime(hr)</Label>
                      <Input
                        id="totalOvertime"
                        type="number"
                        placeholder="0"
                        value={formData.totalOvertime}
                        onChange={(e) =>
                          setFormData({ ...formData, totalOvertime: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalSalary">Total Salary</Label>
                      <Input
                        id="totalSalary"
                        type="number"
                        value={formData.totalSalary}
                        readOnly
                        className="bg-muted border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="advanceAmount">Advance Amount</Label>
                      <Input
                        id="advanceAmount"
                        type="number"
                        placeholder="0"
                        value={formData.advanceAmount}
                        onChange={(e) =>
                          setFormData({ ...formData, advanceAmount: e.target.value })
                        }
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transactionAccount">Transaction Account</Label>
                      <Select
                        value={formData.transactionAccount}
                        onValueChange={(value) =>
                          setFormData({ ...formData, transactionAccount: value })
                        }
                      >
                        <SelectTrigger className="border-primary/30 focus:border-primary">
                          <SelectValue placeholder="Select Account" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="CASH">CASH</SelectItem>
                          <SelectItem value="BANK">BANK</SelectItem>
                          <SelectItem value="BKASH">BKASH</SelectItem>
                          <SelectItem value="NAGAD">NAGAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="payAmount">Pay Amount</Label>
                      <Input
                        id="payAmount"
                        type="number"
                        value={formData.payAmount}
                        readOnly
                        className="bg-muted border-border"
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
                        <TableHead className="text-primary-foreground font-semibold">Employee</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Month</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Basic Salary</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Overtime</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Total Salary</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Paid</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSalaryRecords.map((record, index) => (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{record.employeeName}</TableCell>
                          <TableCell>{record.salaryMonth}</TableCell>
                          <TableCell>৳ {record.basicSalary.toLocaleString()}</TableCell>
                          <TableCell>
                            {record.totalOvertime}hr × ৳{record.overtimeRate}
                          </TableCell>
                          <TableCell>৳ {record.totalSalary.toLocaleString()}</TableCell>
                          <TableCell>৳ {record.payAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              record.status === "Paid" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                              {record.status}
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
                    Showing 1 to {mockSalaryRecords.length} of {mockSalaryRecords.length} entries
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

export default Salary;
