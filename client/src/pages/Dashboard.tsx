import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const todaySummary = [
    { label: "TODAY SOLD", value: "৳12,450", bg: "bg-[hsl(172,66%,40%)]" },
    { label: "TODAY SOLD - PURCHASE COST", value: "৳8,200", bg: "bg-[hsl(15,70%,55%)]" },
    { label: "TODAY EXPENSE", value: "৳1,500", bg: "bg-[hsl(45,85%,55%)]" },
    { label: "TODAY SELL PROFIT", value: "৳2,750", bg: "bg-[hsl(340,65%,55%)]" },
  ];

  const currentMonthSummary = [
    { label: "SOLD IN JAN 2026", value: "৳92,789", bg: "bg-[hsl(172,66%,40%)]" },
    { label: "PURCHASED - IN JAN 2026", value: "৳11,205", bg: "bg-[hsl(200,15%,45%)]" },
    { label: "EXPENSE IN JAN 2026", value: "৳4,500", bg: "bg-[hsl(45,85%,55%)]" },
    { label: "RETURNED IN JAN 2026", value: "৳0", bg: "bg-[hsl(172,66%,50%)]" },
    { label: "PROFIT JAN 2026", value: "৳7,349", bg: "bg-[hsl(145,60%,45%)]" },
  ];

  const totalSummary = [
    { label: "TOTAL SOLD", value: "৳4,89,989", bg: "bg-[hsl(200,15%,45%)]" },
    { label: "TOTAL PURCHASED", value: "৳37,038,205", bg: "bg-[hsl(15,70%,55%)]" },
    { label: "TOTAL EXPENSE", value: "৳25,000", bg: "bg-[hsl(45,85%,55%)]" },
    { label: "TOTAL RETURNED", value: "৳0", bg: "bg-[hsl(172,66%,50%)]" },
    { label: "TOTAL PROFIT", value: "৳4,649", bg: "bg-[hsl(145,60%,45%)]" },
  ];

  const financialSummary = [
    { label: "TOTAL RECEIVABLE", value: "৳2,05,205", bg: "bg-[hsl(280,60%,55%)]" },
    { label: "TOTAL PAYABLE", value: "৳0", bg: "bg-[hsl(15,70%,55%)]" },
    { label: "TOTAL ASSETS", value: "৳0", bg: "bg-[hsl(45,85%,55%)]" },
    { label: "TOTAL BALANCE", value: "৳2,84,789", bg: "bg-[hsl(172,66%,50%)]" },
  ];

  const stockSummary = [
    { label: "STOCK - PURCHASE VALUE", value: "৳33,369,242", bg: "bg-[hsl(200,70%,55%)]", wide: true },
    { label: "STOCK - SELL VALUE", value: "৳35,192,106", bg: "bg-[hsl(200,15%,35%)]", wide: true },
  ];

  const countSummary = [
    { label: "TOTAL CUSTOMER", value: "5", bg: "bg-[hsl(200,15%,45%)]" },
    { label: "TOTAL SUPPLIER", value: "7", bg: "bg-[hsl(172,66%,50%)]" },
    { label: "TOTAL INVOICES", value: "7", bg: "bg-[hsl(340,65%,55%)]" },
    { label: "TOTAL PRODUCT", value: "13", bg: "bg-[hsl(280,60%,55%)]" },
  ];

  const SummaryCard = ({ label, value, bg, wide = false }: { label: string; value: string; bg: string; wide?: boolean }) => (
    <div className={`${bg} rounded-md p-4 text-white ${wide ? 'col-span-2' : ''}`}>
      <p className="text-xs font-medium opacity-90 mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Today Summary */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Today Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todaySummary.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {/* Current Month Summary */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Current Month Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {currentMonthSummary.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {/* Total Summary */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Total Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {totalSummary.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {/* Financial Summary */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialSummary.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {/* Stock Summary */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {stockSummary.map((item) => (
              <SummaryCard key={item.label} {...item} wide />
            ))}
          </div>
        </section>

        {/* Count Summary */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {countSummary.map((item) => (
              <SummaryCard key={item.label} {...item} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-4 border-t border-border">
          Copyright © 2026 <span className="text-primary font-medium">SOFTGHOR</span>. All rights reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
