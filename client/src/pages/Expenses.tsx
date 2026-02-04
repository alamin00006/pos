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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Eye, Edit, Trash2, MoreHorizontal, Plus, List } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  category: string;
  transactionAccount: string;
  note: string;
}

interface ExpenseCategory {
  id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
}

const Expenses = () => {
  const [activeTab, setActiveTab] = useState("expenses");
  
  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    name: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "",
    transactionAccount: "CASH",
    note: "",
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  // Mock data
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: "Office Rent", amount: 15000, date: "2026-01-15", category: "Rent", transactionAccount: "BANK", note: "Monthly rent" },
    { id: 2, name: "Internet Bill", amount: 2500, date: "2026-01-20", category: "Utilities", transactionAccount: "CASH", note: "" },
    { id: 3, name: "Office Supplies", amount: 3200, date: "2026-01-25", category: "Supplies", transactionAccount: "CASH", note: "Stationery items" },
  ]);

  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([
    { id: 1, name: "Rent", description: "Monthly rent expenses", status: "Active" },
    { id: 2, name: "Utilities", description: "Electricity, water, internet bills", status: "Active" },
    { id: 3, name: "Supplies", description: "Office supplies and stationery", status: "Active" },
    { id: 4, name: "Transportation", description: "Travel and transport costs", status: "Active" },
  ]);

  // Filters
  const [expenseFilters, setExpenseFilters] = useState({
    name: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  });

  const [categoryFilters, setCategoryFilters] = useState({
    name: "",
  });

  // Pagination
  const [currentExpensePage, setCurrentExpensePage] = useState(1);
  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const itemsPerPage = 10;

  const handleExpenseFormChange = (field: string, value: string) => {
    setExpenseForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryFormChange = (field: string, value: string) => {
    setCategoryForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveExpense = () => {
    if (!expenseForm.name || !expenseForm.amount || !expenseForm.category) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      id: expenses.length + 1,
      name: expenseForm.name,
      amount: parseFloat(expenseForm.amount),
      date: expenseForm.date,
      category: expenseForm.category,
      transactionAccount: expenseForm.transactionAccount,
      note: expenseForm.note,
    };

    setExpenses([...expenses, newExpense]);
    setExpenseForm({
      name: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      category: "",
      transactionAccount: "CASH",
      note: "",
    });
    toast({
      title: "Success",
      description: "Expense added successfully",
    });
    setActiveTab("expenses");
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name) {
      toast({
        title: "Error",
        description: "Please enter category name",
        variant: "destructive",
      });
      return;
    }

    const newCategory: ExpenseCategory = {
      id: expenseCategories.length + 1,
      name: categoryForm.name,
      description: categoryForm.description,
      status: "Active",
    };

    setExpenseCategories([...expenseCategories, newCategory]);
    setCategoryForm({ name: "", description: "" });
    toast({
      title: "Success",
      description: "Expense category added successfully",
    });
  };

  const handleDeleteExpense = (id: number) => {
    setExpenses(expenses.filter((e) => e.id !== id));
    toast({
      title: "Deleted",
      description: "Expense deleted successfully",
    });
  };

  const handleDeleteCategory = (id: number) => {
    setExpenseCategories(expenseCategories.filter((c) => c.id !== id));
    toast({
      title: "Deleted",
      description: "Expense category deleted successfully",
    });
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesName = expense.name.toLowerCase().includes(expenseFilters.name.toLowerCase());
    const matchesCategory = !expenseFilters.category || expense.category === expenseFilters.category;
    return matchesName && matchesCategory;
  });

  // Filter categories
  const filteredCategories = expenseCategories.filter((cat) =>
    cat.name.toLowerCase().includes(categoryFilters.name.toLowerCase())
  );

  // Pagination logic
  const paginatedExpenses = filteredExpenses.slice(
    (currentExpensePage - 1) * itemsPerPage,
    currentExpensePage * itemsPerPage
  );

  const paginatedCategories = filteredCategories.slice(
    (currentCategoryPage - 1) * itemsPerPage,
    currentCategoryPage * itemsPerPage
  );

  const totalExpensePages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const totalCategoryPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <DashboardLayout title="Expense">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger
              value="expenses"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              <List className="w-4 h-4 mr-2" />
              EXPENSES
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD EXPENSE
            </TabsTrigger>
            <TabsTrigger
              value="categories"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3"
            >
              EXPENSE CATEGORIES
            </TabsTrigger>
          </TabsList>

          {/* Expenses List Tab */}
          <TabsContent value="expenses" className="mt-0">
            <Card>
              <CardContent className="p-6">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <Label>Expense Name</Label>
                    <Input
                      placeholder="Search by name"
                      value={expenseFilters.name}
                      onChange={(e) =>
                        setExpenseFilters({ ...expenseFilters, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={expenseFilters.category}
                      onValueChange={(value) =>
                        setExpenseFilters({ ...expenseFilters, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date From</Label>
                    <Input
                      type="date"
                      value={expenseFilters.dateFrom}
                      onChange={(e) =>
                        setExpenseFilters({ ...expenseFilters, dateFrom: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Date To</Label>
                    <Input
                      type="date"
                      value={expenseFilters.dateTo}
                      onChange={(e) =>
                        setExpenseFilters({ ...expenseFilters, dateTo: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-12">SL</TableHead>
                        <TableHead>Expense Name</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="w-24">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedExpenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            No expenses found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedExpenses.map((expense, index) => (
                          <TableRow key={expense.id}>
                            <TableCell>{(currentExpensePage - 1) * itemsPerPage + index + 1}</TableCell>
                            <TableCell className="font-medium">{expense.name}</TableCell>
                            <TableCell>৳{expense.amount.toLocaleString()}</TableCell>
                            <TableCell>{expense.date}</TableCell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{expense.transactionAccount}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{expense.note || "-"}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteExpense(expense.id)}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentExpensePage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentExpensePage * itemsPerPage, filteredExpenses.length)} of{" "}
                    {filteredExpenses.length} entries
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentExpensePage((p) => Math.max(1, p - 1))}
                      disabled={currentExpensePage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentExpensePage((p) => Math.min(totalExpensePages, p + 1))}
                      disabled={currentExpensePage === totalExpensePages || totalExpensePages === 0}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Expense Tab */}
          <TabsContent value="add" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-6">New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>
                      Expense Name<span className="text-destructive">*</span>:
                    </Label>
                    <Input
                      placeholder="Expense Name"
                      value={expenseForm.name}
                      onChange={(e) => handleExpenseFormChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>
                      Expense Amount<span className="text-destructive">*</span>:
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter Expense Amount"
                      value={expenseForm.amount}
                      onChange={(e) => handleExpenseFormChange("amount", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>
                      Expense Date<span className="text-destructive">*</span>:
                    </Label>
                    <Input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => handleExpenseFormChange("date", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>
                      Expense Category<span className="text-destructive">*</span>:
                    </Label>
                    <Select
                      value={expenseForm.category}
                      onValueChange={(value) => handleExpenseFormChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Transaction Account:</Label>
                    <Select
                      value={expenseForm.transactionAccount}
                      onValueChange={(value) => handleExpenseFormChange("transactionAccount", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">CASH</SelectItem>
                        <SelectItem value="BANK">BANK</SelectItem>
                        <SelectItem value="MOBILE_BANKING">MOBILE BANKING</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Expense Note:</Label>
                    <Textarea
                      placeholder="Enter Optional Note"
                      value={expenseForm.note}
                      onChange={(e) => handleExpenseFormChange("note", e.target.value)}
                      className="min-h-[40px]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={handleSaveExpense} className="gap-2">
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Expense Categories Tab */}
          <TabsContent value="categories" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add Category Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Add Expense Category</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>
                        Category Name<span className="text-destructive">*</span>:
                      </Label>
                      <Input
                        placeholder="Category Name"
                        value={categoryForm.name}
                        onChange={(e) => handleCategoryFormChange("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description:</Label>
                      <Textarea
                        placeholder="Enter Description"
                        value={categoryForm.description}
                        onChange={(e) => handleCategoryFormChange("description", e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSaveCategory} className="w-full gap-2">
                      <Save className="w-4 h-4" />
                      Save Category
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Categories List */}
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Expense Categories</h3>
                    <Input
                      placeholder="Search category..."
                      className="w-64"
                      value={categoryFilters.name}
                      onChange={(e) => setCategoryFilters({ name: e.target.value })}
                    />
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">SL</TableHead>
                          <TableHead>Category Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-24">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedCategories.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No categories found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedCategories.map((cat, index) => (
                            <TableRow key={cat.id}>
                              <TableCell>{(currentCategoryPage - 1) * itemsPerPage + index + 1}</TableCell>
                              <TableCell className="font-medium">{cat.name}</TableCell>
                              <TableCell>{cat.description || "-"}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    cat.status === "Active"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {cat.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => handleDeleteCategory(cat.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentCategoryPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentCategoryPage * itemsPerPage, filteredCategories.length)} of{" "}
                      {filteredCategories.length} entries
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCategoryPage((p) => Math.max(1, p - 1))}
                        disabled={currentCategoryPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentCategoryPage((p) => Math.min(totalCategoryPages, p + 1))}
                        disabled={currentCategoryPage === totalCategoryPages || totalCategoryPages === 0}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
