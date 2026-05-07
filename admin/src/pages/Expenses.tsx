import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent } from "@/components/ui/card";
import { Save, Trash2, Plus, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useCreateExpenseCategoryMutation,
  useCreateExpenseMutation,
  useDeleteExpenseCategoryMutation,
  useDeleteExpenseMutation,
  useGetExpenseCategoriesQuery,
  useGetExpensesQuery,
} from "@/redux/api/expensesApi";

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString()}`;

const Expenses = () => {
  const [activeTab, setActiveTab] = useState("expenses");
  const [expensePage, setExpensePage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [expenseFilters, setExpenseFilters] = useState({ search: "", categoryId: "all", dateFrom: "", dateTo: "" });
  const [expenseQuery, setExpenseQuery] = useState<any>({ page: 1, limit: 10 });
  const [expenseForm, setExpenseForm] = useState({ title: "", amount: "", date: new Date().toISOString().split("T")[0], categoryId: "", paymentMethod: "cash", description: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  const { data: expensesRes, isLoading: expensesLoading, isFetching: expensesFetching } = useGetExpensesQuery(expenseQuery);
  const { data: categoriesRes, isLoading: categoriesLoading } = useGetExpenseCategoriesQuery({ page: categoryPage, limit: 10 });
  const [createExpense, { isLoading: savingExpense }] = useCreateExpenseMutation();
  const [deleteExpense, { isLoading: deletingExpense }] = useDeleteExpenseMutation();
  const [createCategory, { isLoading: savingCategory }] = useCreateExpenseCategoryMutation();
  const [deleteCategory, { isLoading: deletingCategory }] = useDeleteExpenseCategoryMutation();

  const expenses = expensesRes?.data ?? [];
  const expenseMeta = expensesRes?.meta;
  const categories = categoriesRes?.data ?? [];
  const categoryMeta = categoriesRes?.meta;

  const filterExpenses = () => {
    setExpensePage(1);
    setExpenseQuery({
      page: 1,
      limit: 10,
      search: expenseFilters.search || undefined,
      categoryId: expenseFilters.categoryId !== "all" ? expenseFilters.categoryId : undefined,
      startDate: expenseFilters.dateFrom || undefined,
      endDate: expenseFilters.dateTo || undefined,
    });
  };

  const saveExpense = async () => {
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.categoryId) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    try {
      await createExpense({
        title: expenseForm.title,
        amount: Number(expenseForm.amount),
        categoryId: expenseForm.categoryId,
        date: expenseForm.date || undefined,
        paymentMethod: expenseForm.paymentMethod,
        description: expenseForm.description || undefined,
      }).unwrap();
      setExpenseForm({ title: "", amount: "", date: new Date().toISOString().split("T")[0], categoryId: "", paymentMethod: "cash", description: "" });
      setActiveTab("expenses");
      toast({ title: "Success", description: "Expense added successfully" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.data?.message || "Could not save expense", variant: "destructive" });
    }
  };

  const saveCategory = async () => {
    if (!categoryForm.name) {
      toast({ title: "Error", description: "Please enter category name", variant: "destructive" });
      return;
    }
    try {
      await createCategory(categoryForm).unwrap();
      setCategoryForm({ name: "", description: "" });
      toast({ title: "Success", description: "Expense category added successfully" });
    } catch (error: any) {
      toast({ title: "Save failed", description: error?.data?.message || "Could not save category", variant: "destructive" });
    }
  };

  const removeExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(id).unwrap();
    toast({ title: "Deleted", description: "Expense deleted successfully" });
  };

  const removeCategory = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id).unwrap();
    toast({ title: "Deleted", description: "Expense category deleted successfully" });
  };

  return (
    <DashboardLayout title="Expense">
      <div className="space-y-6">
        <section className="rounded-lg border border-primary/15 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-primary">
              Expense control
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-gray-950">
              Expenses
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Record operating expenses, manage categories, and review spending history.
            </p>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger value="expenses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"><List className="w-4 h-4 mr-2" />EXPENSES</TabsTrigger>
            <TabsTrigger value="add" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"><Plus className="w-4 h-4 mr-2" />ADD EXPENSE</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">EXPENSE CATEGORIES</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-0">
            <Card><CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div><Label>Expense Name</Label><Input value={expenseFilters.search} onChange={(e) => setExpenseFilters({ ...expenseFilters, search: e.target.value })} placeholder="Search by name" /></div>
                <div><Label>Category</Label><Select value={expenseFilters.categoryId} onValueChange={(value) => setExpenseFilters({ ...expenseFilters, categoryId: value })}><SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map((cat: any) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select></div>
                <div><Label>Date From</Label><Input type="date" value={expenseFilters.dateFrom} onChange={(e) => setExpenseFilters({ ...expenseFilters, dateFrom: e.target.value })} /></div>
                <div><Label>Date To</Label><Input type="date" value={expenseFilters.dateTo} onChange={(e) => setExpenseFilters({ ...expenseFilters, dateTo: e.target.value })} /></div>
                <div className="flex items-end"><Button onClick={filterExpenses}>Filter</Button></div>
              </div>
              <div className="border rounded-lg overflow-hidden"><Table><TableHeader><TableRow className="bg-muted/50"><TableHead>SL</TableHead><TableHead>Expense Name</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Method</TableHead><TableHead>Note</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{expensesLoading ? <TableRow><TableCell colSpan={8} className="py-10 text-center">Loading...</TableCell></TableRow> : expenses.length === 0 ? <TableRow><TableCell colSpan={8} className="py-10 text-center">No expenses found</TableCell></TableRow> : expenses.map((expense: any, index: number) => <TableRow key={expense.id}><TableCell>{(expensePage - 1) * 10 + index + 1}</TableCell><TableCell>{expense.title || expense.name}</TableCell><TableCell>{money(expense.amount)}</TableCell><TableCell>{expense.date ? new Date(expense.date).toLocaleDateString() : "-"}</TableCell><TableCell>{expense.category?.name || expense.categoryName || "-"}</TableCell><TableCell>{expense.paymentMethod || "-"}</TableCell><TableCell className="max-w-[160px] truncate">{expense.description || expense.note || "-"}</TableCell><TableCell><Button variant="ghost" size="icon" disabled={deletingExpense} onClick={() => removeExpense(expense.id)}><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>)}</TableBody></Table></div>
              <div className="flex items-center justify-between mt-4"><p className="text-sm text-muted-foreground">Page {expenseMeta?.page ?? expensePage} of {expenseMeta?.totalPages ?? 1}{expensesFetching ? " - Updating..." : ""}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={expensePage <= 1} onClick={() => { const next = Math.max(1, expensePage - 1); setExpensePage(next); setExpenseQuery((prev: any) => ({ ...prev, page: next })); }}>Previous</Button><Button variant="outline" size="sm" disabled={expenseMeta ? expensePage >= expenseMeta.totalPages : true} onClick={() => { const next = expensePage + 1; setExpensePage(next); setExpenseQuery((prev: any) => ({ ...prev, page: next })); }}>Next</Button></div></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="add" className="mt-0">
            <Card><CardContent className="p-6"><h3 className="text-lg font-medium mb-6">New Expense</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div><Label>Expense Name*</Label><Input value={expenseForm.title} onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })} /></div><div><Label>Amount*</Label><Input type="number" value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} /></div><div><Label>Date</Label><Input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })} /></div><div><Label>Category*</Label><Select value={expenseForm.categoryId} onValueChange={(value) => setExpenseForm({ ...expenseForm, categoryId: value })}><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger><SelectContent>{categories.map((cat: any) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent></Select></div><div><Label>Payment Method</Label><Select value={expenseForm.paymentMethod} onValueChange={(value) => setExpenseForm({ ...expenseForm, paymentMethod: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="mobile_money">Mobile Money</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div><div><Label>Note</Label><Textarea value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} /></div></div><div className="mt-6"><Button onClick={saveExpense} disabled={savingExpense} className="gap-2"><Save className="w-4 h-4" />Save</Button></div></CardContent></Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><Card><CardContent className="p-6"><h3 className="text-lg font-medium mb-4">Add Expense Category</h3><div className="space-y-4"><div><Label>Category Name*</Label><Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} /></div><div><Label>Description</Label><Textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></div><Button onClick={saveCategory} disabled={savingCategory} className="w-full gap-2"><Save className="w-4 h-4" />Save Category</Button></div></CardContent></Card><Card className="lg:col-span-2"><CardContent className="p-6"><h3 className="text-lg font-medium mb-4">Expense Categories</h3><div className="border rounded-lg overflow-hidden"><Table><TableHeader><TableRow><TableHead>SL</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{categoriesLoading ? <TableRow><TableCell colSpan={4} className="py-10 text-center">Loading...</TableCell></TableRow> : categories.length === 0 ? <TableRow><TableCell colSpan={4} className="py-10 text-center">No categories found</TableCell></TableRow> : categories.map((cat: any, index: number) => <TableRow key={cat.id}><TableCell>{(categoryPage - 1) * 10 + index + 1}</TableCell><TableCell>{cat.name}</TableCell><TableCell>{cat.description || "-"}</TableCell><TableCell><Button variant="ghost" size="icon" disabled={deletingCategory} onClick={() => removeCategory(cat.id)}><Trash2 className="w-4 h-4" /></Button></TableCell></TableRow>)}</TableBody></Table></div><div className="flex items-center justify-between mt-4"><p className="text-sm text-muted-foreground">Page {categoryMeta?.page ?? categoryPage} of {categoryMeta?.totalPages ?? 1}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={categoryPage <= 1} onClick={() => setCategoryPage((p) => Math.max(1, p - 1))}>Previous</Button><Button variant="outline" size="sm" disabled={categoryMeta ? categoryPage >= categoryMeta.totalPages : true} onClick={() => setCategoryPage((p) => p + 1)}>Next</Button></div></div></CardContent></Card></div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
