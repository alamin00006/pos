"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  Menu,
  ClipboardList,
  UserCog,
  Receipt,
  Undo2,
  FileBarChart,
  ShoppingBag,
  Boxes,
  AlertTriangle,
  FolderTree,
  Tag,
  Wallet,
  Banknote,
  Truck,
  UserCheck,
  Shield,
  Landmark,
  BookOpen,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: UserCog, label: "Owners", path: "/owners" },
      { icon: Landmark, label: "Bank Accounts", path: "/bank-accounts" },
      { icon: BookOpen, label: "Cash Book", path: "/cash-book" },
    ],
  },
  {
    title: "SALE & PURCHASE",
    items: [
      { icon: ShoppingCart, label: "POS", path: "/pos" },
      { icon: Receipt, label: "Sales", path: "/sales" },
      { icon: Undo2, label: "Returns", path: "/returns" },
      {
        icon: FileBarChart,
        label: "Estimate",
        children: [
          { label: "Add Estimate", path: "/estimate/add" },
          { label: "Manage Estimates", path: "/estimates" },
        ],
      },
      {
        icon: ShoppingBag,
        label: "Purchase",
        children: [
          { label: "Add Purchase", path: "/purchase/add" },
          { label: "Manage Purchases", path: "/purchases" },
        ],
      },
      { icon: Boxes, label: "Stock", path: "/stock" },
      {
        icon: AlertTriangle,
        label: "Damages",
        children: [
          { label: "Add Damage", path: "/damage/add" },
          { label: "Damages", path: "/damages" },
        ],
      },
    ],
  },
  {
    title: "PRODUCT INFORMATION",
    items: [
      {
        icon: Package,
        label: "Units",
        children: [
          { label: "Add Unit", path: "/units/add" },
          { label: "Manage Units", path: "/units" },
        ],
      },
      {
        icon: Package,
        label: "Products",
        children: [
          { label: "Add Product", path: "/products/add" },
          { label: "Manage Products", path: "/products" },
        ],
      },
      {
        icon: ClipboardList,
        label: "Categories",
        children: [
          { label: "Add Category", path: "/categories/add" },
          { label: "Manage Categories", path: "/categories" },
        ],
      },
      {
        icon: FolderTree,
        label: "Subcategories",
        path: "/subcategories",
      },
      {
        icon: Tag,
        label: "Brands",
        path: "/brands",
      },
    ],
  },
  {
    title: "EXPENSES & PAYMENT",
    items: [
      {
        icon: Wallet,
        label: "Expenses",
        path: "/expenses",
      },
      {
        icon: Banknote,
        label: "Payments",
        children: [
          { label: "Add Payment", path: "/payments" },
          { label: "Payments", path: "/payments" },
        ],
      },
    ],
  },
  {
    title: "PEOPLES",
    items: [
      {
        icon: Users,
        label: "Customers",
        children: [
          { label: "Add Customer", path: "/customers/add" },
          { label: "Manage Customers", path: "/customers" },
        ],
      },
      {
        icon: Truck,
        label: "Suppliers",
        children: [
          { label: "Add Supplier", path: "/suppliers/add" },
          { label: "Manage Suppliers", path: "/suppliers" },
        ],
      },
      {
        icon: UserCheck,
        label: "Employee and Salary",
        children: [
          { label: "Add Employee", path: "/employees/add" },
          { label: "Manage Employee", path: "/employees" },
          { label: "Add Salary", path: "/salary/add" },
          { label: "Manage Salary", path: "/salary" },
          { label: "Payment List", path: "/salary/payments" },
        ],
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { icon: ClipboardList, label: "Orders", path: "/orders" },
      {
        icon: FileText,
        label: "Profit Loss Report",
        path: "/reports/profit-loss",
      },
      {
        icon: FileText,
        label: "Today Report",
        path: "/reports/today",
      },
      {
        icon: FileText,
        label: "Current Month Report",
        path: "/reports/current-month",
      },
      {
        icon: FileText,
        label: "Summary Report",
        path: "/reports/summary",
      },
      {
        icon: FileText,
        label: "Daily Report",
        path: "/reports/daily",
      },
      {
        icon: FileText,
        label: "Customer Due Report",
        path: "/reports/customer-due",
      },
      {
        icon: FileText,
        label: "Supplier Due Report",
        path: "/reports/supplier-due",
      },
      {
        icon: FileText,
        label: "Low Stock Report",
        path: "/reports/low-stock",
      },
      {
        icon: FileText,
        label: "Top Customer",
        path: "/reports/top-customer",
      },
      {
        icon: FileText,
        label: "Top Product",
        path: "/reports/top-product",
      },
      {
        icon: FileText,
        label: "Top Product - All Time",
        path: "/reports/top-product-all-time",
      },
      {
        icon: FileText,
        label: "Category Wise Report",
        path: "/reports/category-wise",
      },
      {
        icon: FileText,
        label: "Purchase Report",
        path: "/reports/purchase",
      },
      {
        icon: FileText,
        label: "Customer Ledger",
        path: "/reports/customer-ledger",
      },
      {
        icon: FileText,
        label: "Supplier Ledger",
        path: "/reports/supplier-ledger",
      },
    ],
  },
  {
    title: "SETTING & CUSTOMIZE",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
      { icon: Shield, label: "Roles & Permissions", path: "/permissions" },
      { icon: Users, label: "Users", path: "/users" },
      {
        icon: Package,
        label: "Assets Management",
        children: [
          { label: "Add Asset", path: "/assets/add" },
          { label: "Manage Assets", path: "/assets" },
        ],
      },
      { icon: FileText, label: "Backup", path: "/backup" },
    ],
  },
];

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((m) => m !== label) : [...prev, label],
    );
  };

  const isChildActive = (item: MenuItem) => {
    return item.children?.some((child) => location.pathname === child.path);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link className="flex items-center gap-3" href="/dashboard">
          <div className="w-10 h-10 rounded-lg bg-sidebar-accent/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-sidebar-foreground font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
              SoftGhor
            </h1>
            <p className="text-xs text-sidebar-foreground/70">POS System</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            {section.title && (
              <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-4 mb-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive = item.path
                  ? location.pathname === item.path
                  : isChildActive(item);
                const isOpen =
                  openMenus.includes(item.label) || isChildActive(item);

                if (hasChildren) {
                  return (
                    <li key={item.label}>
                      <Collapsible
                        open={isOpen}
                        onOpenChange={() => toggleMenu(item.label)}
                      >
                        <CollapsibleTrigger asChild>
                          <button
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? "bg-sidebar-accent text-sidebar-foreground shadow-md"
                                : "text-sidebar-foreground/90 hover:bg-sidebar-accent/10"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : ""}`}
                              />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            {isOpen ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <ul className="mt-1 ml-4 space-y-1">
                            {item.children?.map((child) => {
                              const isChildItemActive =
                                location.pathname === child.path;
                              return (
                                <li key={child.path}>
                                  <a
                                    href={child.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                                      isChildItemActive
                                        ? "bg-sidebar-accent/20 text-sidebar-foreground"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
                                    }`}
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {child.label}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    <a
                      href={item.path!}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-foreground shadow-md"
                          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/10"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : ""}`}
                      />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white font-semibold">
              {user?.name?.charAt(0) || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-white/70 truncate">{user?.role}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white/80 hover:text-white hover:bg-white/10 border-0"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-header flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-header-foreground hover:bg-header-foreground/10"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <div>
              <h2 className="text-lg font-bold text-header-foreground">
                SOFTGHOR Digital POS Software
              </h2>
              <p className="text-xs text-primary">
                To Order: 01958-104255, 01958-104250
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-header-foreground/50" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64 bg-header-foreground/10 border-0 text-header-foreground placeholder:text-header-foreground/50"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-header-foreground hover:bg-header-foreground/10"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-header-foreground/20">
              <div className="w-8 h-8 rounded-full bg-header-foreground/20 flex items-center justify-center">
                <span className="text-header-foreground text-sm font-semibold">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-header-foreground/70" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
