import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Save, Printer } from "lucide-react";
import { useGetEmployeesQuery } from "@/redux/api/employeesApi";
import { useCreateSalaryPaymentMutation, useGetSalaryPaymentsQuery } from "@/redux/api/salaryApi";

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString()}`;
const currentMonth = () => new Date().toISOString().slice(0, 7);

const Salary = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    salaryMonth: currentMonth(),
    employeeId: "",
    basicSalary: "",
    overtime: "0",
    bonus: "0",
    deductions: "0",
    advance: "0",
    payAmount: "",
    paymentMethod: "cash",
  });

  const [year, month] = formData.salaryMonth.split("-").map(Number);
  const { data: employeesRes } = useGetEmployeesQuery({ page: 1, limit: 100, search: search || undefined });
  const { data, isLoading, isFetching } = useGetSalaryPaymentsQuery({ page, limit: 10 });
  const [createSalary, { isLoading: saving }] = useCreateSalaryPaymentMutation();

  const employees = employeesRes?.data ?? [];
  const salaryRecords = data?.data ?? [];
  const meta = data?.meta;
  const selectedEmployee = employees.find((employee: any) => employee.id === formData.employeeId);

  useEffect(() => {
    if (!selectedEmployee) return;
    const basicSalary = Number(selectedEmployee.salary || 0);
    const total = basicSalary + Number(formData.overtime || 0) + Number(formData.bonus || 0) - Number(formData.deductions || 0) - Number(formData.advance || 0);
    setFormData((prev) => ({ ...prev, basicSalary: String(basicSalary), payAmount: String(Math.max(total, 0)) }));
  }, [selectedEmployee, formData.overtime, formData.bonus, formData.deductions, formData.advance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.salaryMonth) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    try {
      await createSalary({
        employeeId: formData.employeeId,
        year,
        month,
        basicSalary: Number(formData.basicSalary || 0),
        overtime: Number(formData.overtime || 0),
        bonus: Number(formData.bonus || 0),
        deductions: Number(formData.deductions || 0),
        advance: Number(formData.advance || 0),
        paymentMethod: formData.paymentMethod,
      }).unwrap();
      toast({ title: "Success", description: "Salary added successfully" });
      setFormData({ salaryMonth: currentMonth(), employeeId: "", basicSalary: "", overtime: "0", bonus: "0", deductions: "0", advance: "0", payAmount: "", paymentMethod: "cash" });
      setActiveTab("list");
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.data?.message || "Could not save salary", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout title="Salary">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Payroll
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-950">
              Employee Salary
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Prepare monthly salary payments with overtime, bonus, deductions, and advance adjustments.
            </p>
          </div>
        </section>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger value="list" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">EMPLOYEES SALARY</TabsTrigger>
            <TabsTrigger value="add" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">+ NEW EMPLOYEE SALARY</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6"><Card><CardContent className="pt-6"><h3 className="text-lg font-medium text-primary mb-6">Employee Salary</h3><form onSubmit={handleSubmit} className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><Label>Salary Month*</Label><Input type="month" value={formData.salaryMonth} onChange={(e) => setFormData({ ...formData, salaryMonth: e.target.value })} /></div><div><Label>Employee*</Label><Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}><SelectTrigger><SelectValue placeholder="Select Employee" /></SelectTrigger><SelectContent>{employees.map((employee: any) => <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>)}</SelectContent></Select></div></div><div className="grid grid-cols-1 md:grid-cols-4 gap-6"><div><Label>Basic Salary</Label><Input type="number" value={formData.basicSalary} readOnly /></div><div><Label>Overtime Amount</Label><Input type="number" value={formData.overtime} onChange={(e) => setFormData({ ...formData, overtime: e.target.value })} /></div><div><Label>Bonus</Label><Input type="number" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: e.target.value })} /></div><div><Label>Deductions</Label><Input type="number" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: e.target.value })} /></div></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div><Label>Advance Amount</Label><Input type="number" value={formData.advance} onChange={(e) => setFormData({ ...formData, advance: e.target.value })} /></div><div><Label>Payment Method</Label><Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank</SelectItem><SelectItem value="cheque">Cheque</SelectItem></SelectContent></Select></div><div><Label>Pay Amount</Label><Input type="number" value={formData.payAmount} readOnly /></div></div><div className="flex justify-center"><Button type="submit" disabled={saving} className="gap-2"><Save className="w-4 h-4" />Save</Button></div></form></CardContent></Card></TabsContent>

          <TabsContent value="list" className="mt-6"><Card><CardContent className="pt-6"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Search employee</span><Input value={search} onChange={(e) => setSearch(e.target.value)} className="w-48 h-9" /></div><Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}><Printer className="w-4 h-4" />Print</Button></div><div className="rounded-md border overflow-hidden"><Table><TableHeader><TableRow className="bg-primary hover:bg-primary"><TableHead className="text-primary-foreground">SL</TableHead><TableHead className="text-primary-foreground">Employee</TableHead><TableHead className="text-primary-foreground">Month</TableHead><TableHead className="text-primary-foreground">Basic Salary</TableHead><TableHead className="text-primary-foreground">Bonus</TableHead><TableHead className="text-primary-foreground">Deductions</TableHead><TableHead className="text-primary-foreground">Net Pay</TableHead><TableHead className="text-primary-foreground">Method</TableHead></TableRow></TableHeader><TableBody>{isLoading ? <TableRow><TableCell colSpan={8} className="py-10 text-center">Loading...</TableCell></TableRow> : salaryRecords.length === 0 ? <TableRow><TableCell colSpan={8} className="py-10 text-center">No salary records found</TableCell></TableRow> : salaryRecords.map((record: any, index: number) => <TableRow key={record.id}><TableCell>{(page - 1) * 10 + index + 1}</TableCell><TableCell>{record.employee?.name || record.employeeName || "-"}</TableCell><TableCell>{record.month}/{record.year}</TableCell><TableCell>{money(record.basicSalary)}</TableCell><TableCell>{money(record.bonus)}</TableCell><TableCell>{money(Number(record.deductions || 0) + Number(record.advance || 0))}</TableCell><TableCell>{money(record.netSalary || record.totalSalary || record.payAmount)}</TableCell><TableCell>{record.paymentMethod || "-"}</TableCell></TableRow>)}</TableBody></Table></div><div className="flex items-center justify-between mt-4"><p className="text-sm text-muted-foreground">Page {meta?.page ?? page} of {meta?.totalPages ?? 1}{isFetching ? " - Updating..." : ""}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button><Button variant="outline" size="sm" disabled={meta ? page >= meta.totalPages : true} onClick={() => setPage((p) => p + 1)}>Next</Button></div></div></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Salary;
