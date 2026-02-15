import { ReactNode, useMemo, useState } from "react";

import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
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

export interface MenuChild {
  label: string;
  path: string;
  permissionKey?: string;
}

export interface MenuItem {
  icon: React.ElementType;
  label: string;
  path?: string;
  permissionKey?: string;
  children?: MenuChild[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export const menuSections: MenuSection[] = [
  {
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
        permissionKey: "dashboard",
      },
      {
        icon: UserCog,
        label: "Owners",
        path: "/owners",
        permissionKey: "owner_list",
      },
      {
        icon: Landmark,
        label: "Bank Accounts",
        path: "/bank_accounts",
        permissionKey: "bank_account_list",
      },
      {
        icon: BookOpen,
        label: "Cash Book",
        path: "/cash-book",
        permissionKey: "cash_book",
      },
    ],
  },
  {
    title: "SALE & PURCHASE",
    items: [
      {
        icon: ShoppingCart,
        label: "POS",
        path: "/pos",
        permissionKey: "add_sale",
      },
      {
        icon: Receipt,
        label: "Sales",
        path: "/sales",
        permissionKey: "sales_list",
      },
      {
        icon: Undo2,
        label: "Returns",
        path: "/returns",
        permissionKey: "list_return",
      },
      {
        icon: FileBarChart,
        label: "Estimate",
        children: [
          {
            label: "Add Estimate",
            path: "/estimate/add",
            permissionKey: "add_estimate",
          },
          {
            label: "Manage Estimates",
            path: "/estimates",
            permissionKey: "view_estimate",
          },
        ],
      },
      {
        icon: ShoppingBag,
        label: "Purchase",
        children: [
          {
            label: "Add Purchase",
            path: "/purchase/add",
            permissionKey: "add_purchase",
          },
          {
            label: "Manage Purchases",
            path: "/purchases",
            permissionKey: "view_purchase",
          },
        ],
      },
      { icon: Boxes, label: "Stock", path: "/stock", permissionKey: "stock" },
      {
        icon: AlertTriangle,
        label: "Damages",
        children: [
          {
            label: "Add Damage",
            path: "/damage/add",
            permissionKey: "add_damage",
          },
          { label: "Damages", path: "/damages", permissionKey: "view_damage" },
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
          { label: "Add Unit", path: "/units/add", permissionKey: "add_unit" },
          { label: "Manage Units", path: "/units", permissionKey: "units" },
        ],
      },
      {
        icon: Package,
        label: "Products",
        children: [
          {
            label: "Add Product",
            path: "/products/add",
            permissionKey: "add_product",
          },
          {
            label: "Manage Products",
            path: "/products",
            permissionKey: "create_product",
          },
        ],
      },
      {
        icon: ClipboardList,
        label: "Categories",
        children: [
          {
            label: "Add Category",
            path: "/categories/add",
            permissionKey: "add_category",
          },
          {
            label: "Manage Categories",
            path: "/categories",
            permissionKey: "create_category",
          },
        ],
      },
      {
        icon: FolderTree,
        label: "Subcategories",
        path: "/subcategories",
        permissionKey: "product_add_category",
      },
      { icon: Tag, label: "Brands", path: "/brands", permissionKey: "brands" },
    ],
  },
  {
    title: "EXPENSES & PAYMENT",
    items: [
      {
        icon: Wallet,
        label: "Expenses",
        path: "/expenses",
        permissionKey: "add_expense",
      },
      {
        icon: Banknote,
        label: "Payments",
        children: [
          {
            label: "Add Payment",
            path: "/payments",
            permissionKey: "add_payment",
          },
          {
            label: "Payments",
            path: "/payments",
            permissionKey: "view_payment",
          },
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
          {
            label: "Add Customer",
            path: "/customers/add",
            permissionKey: "add_customer",
          },
          {
            label: "Manage Customers",
            path: "/customers",
            permissionKey: "create_customer",
          },
        ],
      },
      {
        icon: Truck,
        label: "Suppliers",
        children: [
          {
            label: "Add Supplier",
            path: "/suppliers/add",
            permissionKey: "add_supplier",
          },
          {
            label: "Manage Suppliers",
            path: "/suppliers",
            permissionKey: "create_supplier",
          },
        ],
      },
      {
        icon: UserCheck,
        label: "Employee and Salary",
        children: [
          {
            label: "Add Employee",
            path: "/employees/add",
            permissionKey: "add_employee",
          },
          {
            label: "Manage Employee",
            path: "/employees",
            permissionKey: "create_employee",
          },
          {
            label: "Add Salary",
            path: "/salary/add",
            permissionKey: "employee_salary",
          },
          {
            label: "Manage Salary",
            path: "/salary",
            permissionKey: "employee_salary",
          },
          {
            label: "Payment List",
            path: "/salary/payments",
            permissionKey: "employee_salary",
          },
        ],
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        icon: ClipboardList,
        label: "Orders",
        path: "/orders",
        permissionKey: "orders",
      },
      {
        icon: FileText,
        label: "Profit Loss Report",
        path: "/reports/profit-loss",
        permissionKey: "profit_loss_report",
      },
      {
        icon: FileText,
        label: "Today Report",
        path: "/reports/today",
        permissionKey: "daily_report",
      },
      {
        icon: FileText,
        label: "Current Month Report",
        path: "/reports/current-month",
        permissionKey: "current_month_report",
      },
      {
        icon: FileText,
        label: "Summary Report",
        path: "/reports/summary",
        permissionKey: "summary_report",
      },
      {
        icon: FileText,
        label: "Daily Report",
        path: "/reports/daily",
        permissionKey: "daily_report",
      },
      {
        icon: FileText,
        label: "Customer Due Report",
        path: "/reports/customer-due",
        permissionKey: "customer_due_report",
      },
      {
        icon: FileText,
        label: "Supplier Due Report",
        path: "/reports/supplier-due",
        permissionKey: "supplier_due_report",
      },
      {
        icon: FileText,
        label: "Low Stock Report",
        path: "/reports/low-stock",
        permissionKey: "low_stock_report",
      },
      {
        icon: FileText,
        label: "Top Customer",
        path: "/reports/top-customer",
        permissionKey: "top_customer_report",
      },
      {
        icon: FileText,
        label: "Top Product",
        path: "/reports/top-product",
        permissionKey: "top_product_report",
      },
      {
        icon: FileText,
        label: "Top Product - All Time",
        path: "/reports/top-product-all-time",
        permissionKey: "top_product_all_time_report",
      },
      {
        icon: FileText,
        label: "Category Wise Report",
        path: "/reports/category-wise",
        permissionKey: "category_wise_report",
      },
      {
        icon: FileText,
        label: "Purchase Report",
        path: "/reports/purchase",
        permissionKey: "purchase_report",
      },
      {
        icon: FileText,
        label: "Customer Ledger",
        path: "/reports/customer-ledger",
        permissionKey: "customer_ledger_report",
      },
      {
        icon: FileText,
        label: "Supplier Ledger",
        path: "/reports/supplier-ledger",
        permissionKey: "supplier_ledger_report",
      },
    ],
  },
  {
    title: "SETTING & CUSTOMIZE",
    items: [
      {
        icon: Settings,
        label: "Settings",
        path: "/settings",
        permissionKey: "settings",
      },
      {
        icon: Shield,
        label: "Roles & Permissions",
        path: "/roles/add",
        permissionKey: "edit_user",
      },
      {
        icon: Users,
        label: "Users",
        path: "/users",
        permissionKey: "create_user",
      },
      {
        icon: Package,
        label: "Assets Management",
        children: [
          {
            label: "Add Asset",
            path: "/assets/add",
            permissionKey: "create_assets",
          },
          {
            label: "Manage Assets",
            path: "/assets",
            permissionKey: "view_assets",
          },
        ],
      },
      {
        icon: FileText,
        label: "Backup",
        path: "/backup",
        permissionKey: "backup",
      },
    ],
  },
];
