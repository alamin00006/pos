import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Printer } from "lucide-react";

interface CashTransaction {
  id: number;
  date: string;
  transactionDetails: string;
  type: "Debit" | "Credit";
  debit: number;
  credit: number;
  balance: number;
}

const CashBook = () => {
  const [transactions] = useState<CashTransaction[]>([]);
  
  const openingBalance = 0.00;
  const previousBalance = 284789;
  const currentBalance = 284789;

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0);
  const totalBalance = transactions.length > 0 
    ? transactions[transactions.length - 1].balance 
    : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout title="Cash Book">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary">Cash Book</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cash Book</CardTitle>
            <Button onClick={handlePrint} className="bg-primary hover:bg-primary/90">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Balance Summary */}
            <div className="space-y-1">
              <p>
                <span className="font-semibold">Opening Blance</span>
                <span className="text-primary"> :{openingBalance.toFixed(2)}</span>
              </p>
              <p>
                <span className="font-semibold">Previous Blance</span>
                <span className="text-primary"> :{previousBalance.toLocaleString()}</span>
              </p>
              <p>
                <span className="font-semibold">Current Blance</span>
                <span className="text-primary"> :{currentBalance.toLocaleString()}</span>
              </p>
            </div>

            {/* Transactions Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary hover:bg-primary">
                    <TableHead className="text-primary-foreground font-semibold">#</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Date</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Transaction Details</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Type</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Debit</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Credit</TableHead>
                    <TableHead className="text-primary-foreground font-semibold">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6}></TableCell>
                      <TableCell className="text-right font-semibold">Total</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {transactions.map((transaction, index) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.transactionDetails}</TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>৳{transaction.debit.toLocaleString()}</TableCell>
                          <TableCell>৳{transaction.credit.toLocaleString()}</TableCell>
                          <TableCell>৳{transaction.balance.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell colSpan={4} className="text-right">Total</TableCell>
                        <TableCell>৳{totalDebit.toLocaleString()}</TableCell>
                        <TableCell>৳{totalCredit.toLocaleString()}</TableCell>
                        <TableCell className="text-primary">৳{totalBalance}</TableCell>
                      </TableRow>
                    </>
                  )}
                  {transactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}></TableCell>
                      <TableCell className="text-primary">৳0</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CashBook;
