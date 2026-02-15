import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Landmark, 
  Plus, 
  List, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
} from "lucide-react";

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  status: "active" | "inactive";
}

const BankAccounts = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [transactionModal, setTransactionModal] = useState<{
    open: boolean;
    type: "deposit" | "withdraw" | "transfer" | null;
    accountId: string | null;
  }>({ open: false, type: null, accountId: null });
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transferToAccount, setTransferToAccount] = useState("");

  const [accounts, setAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      name: "Main Business Account",
      bankName: "Bank of America",
      accountNumber: "1234567890",
      accountHolder: "John Doe",
      balance: 150000,
      status: "active",
    },
    {
      id: "2",
      name: "Savings Account",
      bankName: "Chase Bank",
      accountNumber: "0987654321",
      accountHolder: "John Doe",
      balance: 75000,
      status: "active",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    openingBalance: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      name: formData.name,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountHolder: formData.accountHolder,
      balance: parseFloat(formData.openingBalance) || 0,
      status: "active",
    };
    setAccounts([...accounts, newAccount]);
    setFormData({
      name: "",
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      openingBalance: "",
      description: "",
    });
    toast({
      title: "Bank Account Added",
      description: "New bank account has been created successfully.",
    });
    setActiveTab("list");
  };

  const handleTransaction = () => {
    const amount = parseFloat(transactionAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    setAccounts((prev) =>
      prev.map((account) => {
        if (account.id === transactionModal.accountId) {
          if (transactionModal.type === "deposit") {
            return { ...account, balance: account.balance + amount };
          } else if (transactionModal.type === "withdraw") {
            if (account.balance < amount) {
              toast({
                title: "Insufficient Balance",
                description: "Account balance is not sufficient for this withdrawal.",
                variant: "destructive",
              });
              return account;
            }
            return { ...account, balance: account.balance - amount };
          }
        }
        if (transactionModal.type === "transfer") {
          if (account.id === transactionModal.accountId) {
            return { ...account, balance: account.balance - amount };
          }
          if (account.id === transferToAccount) {
            return { ...account, balance: account.balance + amount };
          }
        }
        return account;
      })
    );

    toast({
      title: "Transaction Successful",
      description: `${transactionModal.type?.charAt(0).toUpperCase()}${transactionModal.type?.slice(1)} of ৳${amount.toLocaleString()} completed.`,
    });

    setTransactionModal({ open: false, type: null, accountId: null });
    setTransactionAmount("");
    setTransactionDescription("");
    setTransferToAccount("");
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountNumber.includes(searchTerm)
  );

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <DashboardLayout title="Bank Accounts">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">Bank Accounts</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Accounts</p>
            <p className="text-2xl font-bold text-foreground">{accounts.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active Accounts</p>
            <p className="text-2xl font-bold text-green-600">
              {accounts.filter((a) => a.status === "active").length}
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-2xl font-bold text-primary">৳{totalBalance.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="list"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <List className="w-4 h-4" />
              ACCOUNT LIST
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Plus className="w-4 h-4" />
              ADD ACCOUNT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            <div className="border border-border rounded-lg overflow-hidden">
              {/* Search */}
              <div className="p-4 border-b border-border bg-muted/30">
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Account Name</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Bank Name</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Account Number</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Account Holder</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Balance</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-primary-foreground font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No bank accounts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAccounts.map((account, index) => (
                      <TableRow key={account.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{account.name}</TableCell>
                        <TableCell>{account.bankName}</TableCell>
                        <TableCell>{account.accountNumber}</TableCell>
                        <TableCell>{account.accountHolder}</TableCell>
                        <TableCell className="font-semibold text-primary">
                          ৳{account.balance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              account.status === "active"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {account.status.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setTransactionModal({
                                    open: true,
                                    type: "deposit",
                                    accountId: account.id,
                                  })
                                }
                              >
                                <ArrowDownToLine className="mr-2 h-4 w-4" />
                                Deposit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setTransactionModal({
                                    open: true,
                                    type: "withdraw",
                                    accountId: account.id,
                                  })
                                }
                              >
                                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                                Withdraw
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setTransactionModal({
                                    open: true,
                                    type: "transfer",
                                    accountId: account.id,
                                  })
                                }
                              >
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Transfer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
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
          </TabsContent>

          <TabsContent value="add" className="mt-0">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  Add New Bank Account
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Account Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Main Business Account"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="e.g., Bank of America"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      placeholder="e.g., 1234567890"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">Account Holder</Label>
                    <Input
                      id="accountHolder"
                      value={formData.accountHolder}
                      onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                      placeholder="e.g., John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openingBalance">Opening Balance</Label>
                    <Input
                      id="openingBalance"
                      type="number"
                      value={formData.openingBalance}
                      onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Account
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("list")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Transaction Modal */}
      <Dialog
        open={transactionModal.open}
        onOpenChange={(open) =>
          setTransactionModal({ open, type: null, accountId: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              {transactionModal.type} Transaction
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            {transactionModal.type === "transfer" && (
              <div className="space-y-2">
                <Label>Transfer To</Label>
                <select
                  className="w-full border border-border rounded-md p-2 bg-background"
                  value={transferToAccount}
                  onChange={(e) => setTransferToAccount(e.target.value)}
                >
                  <option value="">Select account</option>
                  {accounts
                    .filter((a) => a.id !== transactionModal.accountId)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - {account.bankName}
                      </option>
                    ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Input
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setTransactionModal({ open: false, type: null, accountId: null })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleTransaction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BankAccounts;
