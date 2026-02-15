import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ReportDataTable from "@/components/ReportDataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Calendar, FileText } from "lucide-react";

const TodayReport = () => {
  const [activeTab, setActiveTab] = useState("today");

  const summaryCards = [
    { label: "SALE AMOUNT", value: "Tk 0", bg: "bg-[hsl(172,66%,40%)]" },
    { label: "PURCHASE COST", value: "Tk 0", bg: "bg-[hsl(15,70%,55%)]" },
    { label: "EXPENSE", value: "Tk 0", bg: "bg-[hsl(200,15%,45%)]" },
    { label: "SELL PROFIT", value: "Tk 0", bg: "bg-[hsl(0,70%,55%)]" },
  ];

  const topSaleColumns = [
    { key: "id", label: "#", sortable: true },
    { key: "productName", label: "Product Name", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "totalSale", label: "Total Sale", sortable: true },
    { key: "saleAmount", label: "Sale Amount", sortable: true },
  ];

  const expenseColumns = [
    { key: "id", label: "#", sortable: true },
    { key: "expense", label: "Expense", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
  ];

  const payToSupplierColumns = [
    { key: "id", label: "#", sortable: true },
    { key: "supplier", label: "Supplier", sortable: true },
    { key: "paymentDate", label: "Paymnet Date", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
  ];

  const receiveFromCustomerColumns = [
    { key: "id", label: "#", sortable: true },
    { key: "customer", label: "Customer", sortable: true },
    { key: "paymentDate", label: "Paymnet Date", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
  ];

  // Empty data arrays for now
  const topSaleData: Record<string, unknown>[] = [];
  const expenseData: Record<string, unknown>[] = [];
  const payToSupplierData: Record<string, unknown>[] = [];
  const receiveFromCustomerData: Record<string, unknown>[] = [];

  return (
    <DashboardLayout title="Today Report">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary">Today Report</h1>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="today"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              TODAY REPORT
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Calendar className="w-4 h-4" />
              CURRENT MONTH REPORT
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <FileText className="w-4 h-4" />
              SUMMARY REPORT
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-0 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryCards.map((card) => (
                <div
                  key={card.label}
                  className={`${card.bg} rounded-md p-4 text-white`}
                >
                  <p className="text-xs font-medium opacity-90 mb-1">
                    {card.label}
                  </p>
                  <p className="text-xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Data Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Sale Product */}
              <ReportDataTable
                title="Top Sale Product"
                headerColor="teal"
                columns={topSaleColumns}
                data={topSaleData}
                footerTotals={[
                  { label: "Qyt", value: "0" },
                  { label: "Total", value: "0" },
                  { label: "Total", value: "Tk 0" },
                ]}
              />

              {/* Expense */}
              <ReportDataTable
                title="Expense"
                headerColor="coral"
                columns={expenseColumns}
                data={expenseData}
                footerTotals={[{ label: "Tk", value: "0" }]}
              />

              {/* Pay to Supplier */}
              <ReportDataTable
                title="Pay to Supplier"
                headerColor="dark"
                columns={payToSupplierColumns}
                data={payToSupplierData}
                footerTotals={[{ label: "Tk", value: "0" }]}
              />

              {/* Receive from Customer */}
              <ReportDataTable
                title="Receive from Customer"
                headerColor="dark"
                columns={receiveFromCustomerColumns}
                data={receiveFromCustomerData}
                footerTotals={[{ label: "Tk", value: "0" }]}
              />
            </div>
          </TabsContent>

          <TabsContent value="month" className="mt-0">
            <div className="text-center py-12 text-muted-foreground">
              Current Month Report content will be displayed here
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-0">
            <div className="text-center py-12 text-muted-foreground">
              Summary Report content will be displayed here
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026{" "}
          <span className="text-primary font-medium">SOFTGHOR</span>. All rights
          reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default TodayReport;
