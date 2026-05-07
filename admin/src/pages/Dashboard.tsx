import DashboardLayout from "@/components/DashboardLayout";
import type { ReactNode } from "react";
import {
  useGetCurrentMonthReportQuery,
  useGetSummaryReportQuery,
  useGetTodayReportQuery,
} from "@/redux/api/reportsApi";

type Tile = {
  label: string;
  value: string;
  color: string;
  loading?: boolean;
  span?: string;
};

const Dashboard = () => {
  const {
    data: todayResponse,
    isLoading: isTodayLoading,
    isError: isTodayError,
  } = useGetTodayReportQuery();
  const {
    data: monthResponse,
    isLoading: isMonthLoading,
    isError: isMonthError,
  } = useGetCurrentMonthReportQuery();
  const {
    data: summaryResponse,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useGetSummaryReportQuery();

  const today = unwrapReport(todayResponse);
  const month = unwrapReport(monthResponse);
  const summary = unwrapReport(summaryResponse);
  const monthName = month?.month ? formatMonth(month.month) : "CURRENT MONTH";
  const hasReportError = isTodayError || isMonthError || isSummaryError;

  const todayTiles: Tile[] = [
    {
      label: "TODAY SOLD",
      value: money(today?.sales?.total),
      color: "bg-[#475569]",
      loading: isTodayLoading,
    },
    {
      label: "TODAY SOLD - PURCHASE COST",
      value: money(today?.costOfGoodsSold),
      color: "bg-[#ec5b99]",
      loading: isTodayLoading,
    },
    {
      label: "TODAY EXPENSE",
      value: money(today?.expenses?.total),
      color: "bg-[#fb6266]",
      loading: isTodayLoading,
    },
    {
      label: "TODAY SELL PROFIT",
      value: money(today?.profit),
      color: "bg-[#49aee9]",
      loading: isTodayLoading,
    },
  ];

  const monthTiles: Tile[] = [
    {
      label: `SOLD IN ${monthName}`,
      value: money(month?.sales?.total),
      color: "bg-[#35c6b7]",
      loading: isMonthLoading,
    },
    {
      label: `PURCHASED - IN ${monthName}`,
      value: money(month?.purchases?.total),
      color: "bg-[#966c5e]",
      loading: isMonthLoading,
    },
    {
      label: `EXPENSE IN ${monthName}`,
      value: money(month?.expenses?.total),
      color: "bg-[#fb6266]",
      loading: isMonthLoading,
    },
    {
      label: `RETURNED IN ${monthName}`,
      value: money(month?.returns?.total),
      color: "bg-[#58c0cb]",
      loading: isMonthLoading,
    },
    {
      label: `PROFIT ${monthName}`,
      value: money(month?.profit),
      color: "bg-[#8d67dc]",
      loading: isMonthLoading,
    },
  ];

  const totalTiles: Tile[] = [
    {
      label: "TOTAL SOLD",
      value: money(summary?.sales?.total),
      color: "bg-[#475569]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL PURCHASED",
      value: money(summary?.purchases?.total),
      color: "bg-[#19bf73]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL EXPENSE",
      value: money(summary?.expenses?.total),
      color: "bg-[#fb6266]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL RETURNED",
      value: money(summary?.returns?.total),
      color: "bg-[#58c0cb]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL PROFIT",
      value: money(summary?.financial?.totalProfit),
      color: "bg-[#966c5e]",
      loading: isSummaryLoading,
    },
  ];

  const businessTiles: Tile[] = [
    {
      label: "TOTAL RECEIVABLE",
      value: money(summary?.sales?.due),
      color: "bg-[#8d67dc]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL PAYABLE",
      value: money(summary?.purchases?.due),
      color: "bg-[#f9c322]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL ASSETS",
      value: money(summary?.entities?.assets ?? summary?.assets?.total),
      color: "bg-[#ec5b99]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL BALANCE",
      value: money(
        Number(summary?.sales?.received || 0) -
          Number(summary?.purchases?.paid || 0),
      ),
      color: "bg-[#19bf73]",
      loading: isSummaryLoading,
    },
    {
      label: "STOCK - PURCHASE VALUE",
      value: money(
        summary?.stock?.purchaseValue ??
          summary?.financial?.totalCost ??
          summary?.purchases?.total,
      ),
      color: "bg-[#966c5e]",
      loading: isSummaryLoading,
      span: "lg:col-span-2",
    },
    {
      label: "STOCK - SELL VALUE",
      value: money(
        summary?.stock?.sellValue ??
          summary?.financial?.totalRevenue ??
          summary?.sales?.total,
      ),
      color: "bg-[#49aee9]",
      loading: isSummaryLoading,
      span: "lg:col-span-2",
    },
    {
      label: "TOTAL CUSTOMER",
      value: count(summary?.entities?.customers),
      color: "bg-[#475569]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL SUPPLIER",
      value: count(summary?.entities?.suppliers),
      color: "bg-[#966c5e]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL INVOICES",
      value: count(summary?.sales?.count),
      color: "bg-[#fb6266]",
      loading: isSummaryLoading,
    },
    {
      label: "TOTAL PRODUCT",
      value: count(summary?.entities?.products),
      color: "bg-[#8d67dc]",
      loading: isSummaryLoading,
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-7 bg-[#f1f3f5] p-0">
        {hasReportError && (
          <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Some dashboard report data could not be loaded.
          </div>
        )}

        <SummarySection title="Today Summary" columns="lg:grid-cols-4">
          {todayTiles.map((tile) => (
            <SummaryTile key={tile.label} tile={tile} />
          ))}
        </SummarySection>

        <SummarySection title="Current Month Summary" columns="lg:grid-cols-5">
          {monthTiles.map((tile) => (
            <SummaryTile key={tile.label} tile={tile} />
          ))}
        </SummarySection>

        <SummarySection title="Total Summary" columns="lg:grid-cols-5">
          {totalTiles.map((tile) => (
            <SummaryTile key={tile.label} tile={tile} />
          ))}
        </SummarySection>

        <div className="grid grid-cols-1 gap-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {businessTiles.map((tile) => (
              <SummaryTile key={tile.label} tile={tile} />
            ))}
          </div>
        </div>

        <footer className="bg-white px-4 py-5 text-sm text-slate-500">
          Copyright 2026{" "}
          <span className="font-medium text-primary">POS Software</span>. All
          rights reserved.
        </footer>
      </div>
    </DashboardLayout>
  );
};

const SummarySection = ({
  title,
  columns,
  children,
}: {
  title: string;
  columns: string;
  children: ReactNode;
}) => (
  <section className="bg-white px-4 py-3">
    <h2 className="border-b border-slate-200 pb-2 text-xl font-normal text-slate-700">
      {title}
    </h2>
    <div className={`mt-3 grid grid-cols-1 gap-6 sm:grid-cols-2 ${columns}`}>
      {children}
    </div>
  </section>
);

const SummaryTile = ({ tile }: { tile: Tile }) => (
  <div
    className={`${tile.color} ${tile.span ?? ""} min-h-[85px] px-5 py-6 text-white shadow-sm`}
  >
    <p className="text-sm font-semibold uppercase tracking-wide text-white/95">
      {tile.label}
    </p>
    <p className="mt-1 text-2xl font-bold leading-tight">
      {tile.loading ? "Loading..." : tile.value}
    </p>
  </div>
);

export default Dashboard;

const unwrapReport = (response: any) => response?.data ?? response ?? {};

const money = (value: unknown) =>
  `Tk ${Number(value || 0).toLocaleString("en-US")}`;

const count = (value: unknown) => Number(value || 0).toLocaleString("en-US");

const formatMonth = (value: string) => {
  const date = new Date(`${value}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "CURRENT MONTH";
  }
  return date
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
};
