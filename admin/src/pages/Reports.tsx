import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Package, 
  Calendar,
  Download,
  BarChart3,
  PieChart
} from "lucide-react";
import {
  useGetCategoryWiseReportQuery,
  useGetDailyReportQuery,
  useGetSummaryReportQuery,
  useGetTopProductsReportQuery,
} from "@/redux/api/reportsApi";

const money = (value: number) => `Tk ${Number(value || 0).toLocaleString()}`;

const salesData = [
  { date: "2026-01-30", orders: 45, revenue: 78500, profit: 15700 },
  { date: "2026-01-29", orders: 52, revenue: 92300, profit: 18460 },
  { date: "2026-01-28", orders: 38, revenue: 65400, profit: 13080 },
  { date: "2026-01-27", orders: 61, revenue: 105600, profit: 21120 },
  { date: "2026-01-26", orders: 49, revenue: 84200, profit: 16840 },
  { date: "2026-01-25", orders: 55, revenue: 96800, profit: 19360 },
  { date: "2026-01-24", orders: 42, revenue: 71500, profit: 14300 },
];

const topSellingProducts = [
  { name: "Rice (50kg)", sold: 245, revenue: 612500 },
  { name: "Oil (5L)", sold: 189, revenue: 160650 },
  { name: "Sugar (1kg)", sold: 312, revenue: 31200 },
  { name: "Flour (2kg)", sold: 156, revenue: 18720 },
  { name: "Eggs (12 pcs)", sold: 134, revenue: 24120 },
];

const categoryStats = [
  { category: "Grocery", sales: 456000, percentage: 55 },
  { category: "Dairy", sales: 198000, percentage: 24 },
  { category: "Bakery", sales: 89000, percentage: 11 },
  { category: "Snacks", sales: 82000, percentage: 10 },
];

const Reports = () => {
  const [period, setPeriod] = useState("This Week");
  const { data: summaryRes } = useGetSummaryReportQuery();
  const { data: dailyRes } = useGetDailyReportQuery({ period });
  const { data: topProductsRes } = useGetTopProductsReportQuery({ limit: 5 });
  const { data: categoryRes } = useGetCategoryWiseReportQuery({ period });

  const summary = summaryRes?.data ?? summaryRes ?? {};
  const dailyRows = dailyRes?.data ?? dailyRes?.rows ?? salesData;
  const productRows = topProductsRes?.data ?? topProductsRes?.rows ?? topSellingProducts;
  const categoryRows = categoryRes?.data ?? categoryRes?.rows ?? categoryStats;

  const stats = [
    { 
      title: "Total Revenue", 
      value: money(summary.totalRevenue ?? summary.revenue ?? 594300), 
      change: "+12.5%", 
      trend: "up",
      icon: DollarSign 
    },
    { 
      title: "Total Orders", 
      value: String(summary.totalOrders ?? summary.orders ?? 342), 
      change: "+8.2%", 
      trend: "up",
      icon: ShoppingCart 
    },
    { 
      title: "Products Sold", 
      value: String(summary.productsSold ?? summary.totalProductsSold ?? 1847), 
      change: "+15.3%", 
      trend: "up",
      icon: Package 
    },
    { 
      title: "Avg. Order Value", 
      value: money(summary.avgOrderValue ?? 1738), 
      change: "-2.1%", 
      trend: "down",
      icon: TrendingUp 
    },
  ];

  return (
    <DashboardLayout title="Reports">
      {/* Period Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["Today", "This Week", "This Month", "This Year"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-primary" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-primary" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Sales Overview
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sales Chart Visualization</p>
                <p className="text-sm">Interactive chart would display here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Sales by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="space-y-4">
              {categoryRows.map((cat: any) => (
                <li key={cat.category || cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{cat.category || cat.name}</span>
                    <span className="text-sm text-muted-foreground">{cat.percentage ?? cat.percent ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${cat.percentage ?? cat.percent ?? 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">৳{cat.sales.toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Sales Table */}
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyRows.map((day: any) => (
                  <TableRow key={day.date}>
                    <TableCell className="font-medium">{day.date}</TableCell>
                    <TableCell>{day.orders ?? day.totalOrders ?? 0}</TableCell>
                    <TableCell>৳{day.revenue.toLocaleString()}</TableCell>
                    <TableCell className="text-primary">৳{day.profit.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productRows.map((product: any, index: number) => (
                  <TableRow key={product.id || product.name}>
                    <TableCell>
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{product.name || product.productName}</TableCell>
                    <TableCell>{product.sold ?? product.quantity ?? product.totalSold ?? 0}</TableCell>
                    <TableCell className="text-primary font-medium">৳{product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
