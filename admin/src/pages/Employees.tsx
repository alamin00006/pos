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
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/redux/api/employeesApi";

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString()}`;

const Employees = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    joiningDate: new Date().toISOString().split("T")[0],
    name: "",
    email: "",
    phone: "",
    salary: "",
    overtimeRate: "",
    address: "",
  });

  const { data, isLoading, isFetching } = useGetEmployeesQuery({
    page,
    limit,
    search: search || undefined,
  });
  const [createEmployee, { isLoading: creating }] = useCreateEmployeeMutation();
  const [deleteEmployee, { isLoading: deleting }] = useDeleteEmployeeMutation();

  const employees = data?.data ?? [];
  const meta = data?.meta;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.salary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createEmployee({
        name: formData.name,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        salary: Number(formData.salary),
        joiningDate: formData.joiningDate || undefined,
        status: "active",
        notes: formData.overtimeRate ? `Overtime rate: ${formData.overtimeRate}` : undefined,
      }).unwrap();
      toast({ title: "Success", description: "Employee added successfully" });
      setFormData({
        joiningDate: new Date().toISOString().split("T")[0],
        name: "",
        email: "",
        phone: "",
        salary: "",
        overtimeRate: "",
        address: "",
      });
      setActiveTab("list");
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error?.data?.message || "Could not save employee",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id).unwrap();
      toast({ title: "Deleted", description: "Employee deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error?.data?.message || "Could not delete employee",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Employees">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Team management
            </p>
            <h1 className="text-2xl font-semibold text-gray-950">Employees</h1>
            <p className="text-sm text-gray-500">
              Manage employee profiles, salary information, joining dates, and status.
            </p>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto">
            <TabsTrigger value="list" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">
              EMPLOYEES
            </TabsTrigger>
            <TabsTrigger value="add" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">
              + NEW EMPLOYEE
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="mt-6">
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-950 mb-1">New Employee</h3>
                <p className="mb-6 text-sm text-gray-500">Add employee details for payroll and staff tracking.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input id="joiningDate" type="date" value={formData.joiningDate} onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name<span className="text-destructive">*</span></Label>
                      <Input id="name" placeholder="Enter employee name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="employee@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary<span className="text-destructive">*</span></Label>
                      <Input id="salary" type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeRate">Overtime Rate</Label>
                      <Input id="overtimeRate" type="number" value={formData.overtimeRate} onChange={(e) => setFormData({ ...formData, overtimeRate: e.target.value })} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={3} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={creating} className="gap-2 bg-primary hover:bg-primary/90">
                      <Save className="w-4 h-4" /> Save
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <Card className="border-primary/10 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <select className="border border-border rounded px-2 py-1 text-sm bg-background" value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-muted-foreground">entries</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
                      <Printer className="w-4 h-4" /> Print
                    </Button>
                    <Input placeholder="Search..." className="w-48 h-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
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
                        <TableHead className="text-primary-foreground font-semibold">Notes</TableHead>
                        <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
                        <TableHead className="text-primary-foreground font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={7} className="py-10 text-center">Loading...</TableCell></TableRow>
                      ) : employees.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="py-10 text-center">No employees found</TableCell></TableRow>
                      ) : employees.map((employee: any, index: number) => (
                        <TableRow key={employee.id} className="hover:bg-muted/50">
                          <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-muted-foreground">Phone: {employee.phone || "-"}</p>
                              <p className="text-sm text-muted-foreground">Email: {employee.email || "-"}</p>
                            </div>
                          </TableCell>
                          <TableCell>{employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>{money(employee.salary)}</TableCell>
                          <TableCell>{employee.notes || "-"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${employee.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {employee.status || "active"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-popover">
                                  <DropdownMenuItem className="gap-2 cursor-pointer"><Eye className="w-4 h-4" />View</DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer"><Pencil className="w-4 h-4" />Edit</DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" disabled={deleting} onClick={() => handleDelete(employee.id)}><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
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
                  <p className="text-sm text-muted-foreground">Page {meta?.page ?? page} of {meta?.totalPages ?? 1}{isFetching ? " - Updating..." : ""}</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
                    <Button variant="default" size="sm" className="bg-primary">{page}</Button>
                    <Button variant="outline" size="sm" disabled={meta ? page >= meta.totalPages : true} onClick={() => setPage((p) => p + 1)}>Next</Button>
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
