import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield } from "lucide-react";

interface Permission {
  id: string;
  label: string;
  checked: boolean;
}

interface PermissionSection {
  title: string;
  permissions: Permission[];
}

const initialPermissions: PermissionSection[] = [
  {
    title: "Unit",
    permissions: [
      { id: "add_unit", label: "Add Unit", checked: true },
      { id: "units", label: "Units", checked: true },
      { id: "edit_unit", label: "Edit Unit", checked: true },
    ],
  },
  {
    title: "Owner",
    permissions: [
      { id: "add_owner", label: "Add Owner", checked: true },
      { id: "owner_list", label: "Owner List", checked: true },
      { id: "edit_owner", label: "Edit Owner", checked: true },
      { id: "delete_owner", label: "Delete Owner", checked: true },
    ],
  },
  {
    title: "Bank Account",
    permissions: [
      { id: "add_bank_account", label: "Add Bank Account", checked: true },
      { id: "bank_account_list", label: "Bank Account List", checked: true },
      { id: "create_bank_deposit", label: "Create Bank Deposit", checked: true },
      { id: "bank_account_withdraw", label: "Bank Account Withdraw", checked: true },
      { id: "bank_account_transfer", label: "Bank Account Transfer", checked: true },
      { id: "bank_account_delete", label: "Bank Account Delete", checked: true },
    ],
  },
  {
    title: "Brand",
    permissions: [
      { id: "add_brand", label: "Add Brand", checked: true },
      { id: "brands", label: "Brands", checked: true },
      { id: "edit_brand", label: "Edit Brand", checked: true },
      { id: "delete_brand", label: "Delete Brand", checked: true },
    ],
  },
  {
    title: "Category",
    permissions: [
      { id: "add_category", label: "Add Category", checked: true },
      { id: "create_category", label: "Create Category", checked: true },
      { id: "edit_category", label: "Edit Category", checked: true },
      { id: "delete_category", label: "Delete Category", checked: true },
    ],
  },
  {
    title: "Product",
    permissions: [
      { id: "add_product", label: "Add Product", checked: true },
      { id: "create_product", label: "Create Product", checked: true },
      { id: "edit_product", label: "Edit Product", checked: true },
      { id: "update_sell_price", label: "Update Sell Price", checked: true },
      { id: "product_add_category", label: "Product Add Category", checked: true },
      { id: "barcode_add_stock", label: "Barcode Add Stock", checked: true },
      { id: "delete_product", label: "Delete Product", checked: true },
    ],
  },
  {
    title: "POS",
    permissions: [
      { id: "add_sale", label: "Add Sale", checked: true },
      { id: "sales_list", label: "Sales List", checked: true },
      { id: "sale_trip", label: "Sale Trip", checked: true },
      { id: "view_sale", label: "View Sale", checked: true },
      { id: "edit_sale_payment", label: "Edit Sale Payment", checked: true },
      { id: "pos_add_customer", label: "POS Add Customer", checked: true },
      { id: "edit_discount", label: "Edit Discount", checked: true },
      { id: "sale_receipt", label: "Sale Receipt", checked: true },
      { id: "pos_refund_sale", label: "POS Refund Sale", checked: true },
      { id: "pos_duplicate_sale", label: "POS Duplicate Sale", checked: true },
    ],
  },
  {
    title: "Estimate",
    permissions: [
      { id: "add_estimate", label: "Add Estimate", checked: true },
      { id: "view_estimate", label: "View Estimate", checked: true },
      { id: "edit_estimate", label: "Edit Estimate", checked: true },
      { id: "delete_estimate", label: "Delete Estimate", checked: true },
    ],
  },
  {
    title: "Return",
    permissions: [
      { id: "list_return", label: "List Return", checked: true },
      { id: "delete_return", label: "Delete Return", checked: true },
    ],
  },
  {
    title: "Purchase",
    permissions: [
      { id: "add_purchase", label: "Add Purchase", checked: true },
      { id: "create_purchase", label: "Create Purchase", checked: true },
      { id: "view_purchase", label: "View Purchase", checked: true },
      { id: "edit_purchase", label: "Edit Purchase", checked: true },
      { id: "purchase_add_payment", label: "Purchase Add Payment", checked: true },
      { id: "purchase_add_supplier", label: "Purchase Add Supplier", checked: true },
      { id: "purchase_receipt", label: "Purchase Receipt", checked: true },
    ],
  },
  {
    title: "Customer",
    permissions: [
      { id: "add_customer", label: "Add Customer", checked: true },
      { id: "create_customer", label: "Create Customer", checked: true },
      { id: "edit_customer", label: "Edit Customer", checked: true },
      { id: "delete_customer", label: "Delete Customer", checked: true },
      { id: "customer_make_payment", label: "Customer Make Payment", checked: true },
      { id: "customer_ledger", label: "Customer Ledger", checked: true },
    ],
  },
  {
    title: "Supplier",
    permissions: [
      { id: "add_supplier", label: "Add Supplier", checked: true },
      { id: "create_supplier", label: "Create Supplier", checked: true },
      { id: "edit_supplier", label: "Edit Supplier", checked: true },
      { id: "delete_supplier", label: "Delete Supplier", checked: true },
      { id: "supplier_make_payment", label: "Supplier Make Payment", checked: true },
      { id: "supplier_ledger", label: "Supplier Ledger", checked: true },
    ],
  },
  {
    title: "Employee",
    permissions: [
      { id: "add_employee", label: "Add Employee", checked: true },
      { id: "create_employee", label: "Create Employee", checked: true },
      { id: "edit_employee", label: "Edit Employee", checked: true },
      { id: "delete_employee", label: "Delete Employee", checked: true },
      { id: "employee_salary", label: "Employee Salary", checked: true },
    ],
  },
  {
    title: "Expense Category",
    permissions: [
      { id: "add_expense_category", label: "Add Expense Category", checked: true },
      { id: "create_expense_category", label: "Create Expense Category", checked: true },
      { id: "edit_expense_category", label: "Edit Expense Category", checked: true },
      { id: "delete_expense_category", label: "Delete Expense Category", checked: true },
    ],
  },
  {
    title: "Expense",
    permissions: [
      { id: "add_expense", label: "Add Expense", checked: true },
      { id: "create_expense", label: "Create Expense", checked: true },
      { id: "edit_expense", label: "Edit Expense", checked: true },
      { id: "delete_expense", label: "Delete Expense", checked: true },
    ],
  },
  {
    title: "Payment",
    permissions: [
      { id: "add_payment", label: "Add Payment", checked: true },
      { id: "create_payment", label: "Create Payment", checked: true },
      { id: "view_payment", label: "View Payment", checked: true },
      { id: "delete_payment", label: "Delete Payment", checked: true },
    ],
  },
  {
    title: "Damage",
    permissions: [
      { id: "add_damage", label: "Add Damage", checked: true },
      { id: "create_damage", label: "Create Damage", checked: true },
      { id: "view_damage", label: "View Damage", checked: true },
      { id: "delete_damage", label: "Delete Damage", checked: true },
    ],
  },
  {
    title: "SMS",
    permissions: [
      { id: "add_sms", label: "Add SMS", checked: true },
      { id: "create_sms", label: "Create SMS", checked: true },
      { id: "edit_sms", label: "Edit SMS", checked: true },
      { id: "delete_sms", label: "Delete SMS", checked: true },
    ],
  },
  {
    title: "User",
    permissions: [
      { id: "add_user", label: "Add User", checked: true },
      { id: "create_user", label: "Create User", checked: true },
      { id: "edit_user", label: "Edit User", checked: true },
      { id: "delete_user", label: "Delete User", checked: true },
    ],
  },
  {
    title: "Cash Book",
    permissions: [
      { id: "cash_book", label: "Cash Book", checked: true },
    ],
  },
  {
    title: "Misc",
    permissions: [
      { id: "stock", label: "Stock", checked: true },
    ],
  },
  {
    title: "Promotional Sms",
    permissions: [
      { id: "promotional_sms", label: "Promotional Sms", checked: true },
    ],
  },
  {
    title: "Report",
    permissions: [
      { id: "profit_loss_report", label: "Profit Loss Report", checked: true },
      { id: "current_month_report", label: "Current Month Report", checked: true },
      { id: "summary_report", label: "Summary Report", checked: true },
      { id: "daily_report", label: "Daily Report", checked: true },
      { id: "customer_due_report", label: "Customer Due Report", checked: true },
      { id: "supplier_due_report", label: "Supplier Due Report", checked: true },
      { id: "low_stock_report", label: "Low Stock Report", checked: true },
      { id: "top_customer_report", label: "Top Customer Report", checked: true },
      { id: "top_product_report", label: "Top Product Report", checked: true },
      { id: "top_product_all_time_report", label: "Top Product - All Time Report", checked: true },
      { id: "category_wise_report", label: "Category Wise Report", checked: true },
      { id: "purchase_report", label: "Purchase Report", checked: true },
      { id: "customer_ledger_report", label: "Customer Ledger", checked: true },
      { id: "supplier_ledger_report", label: "Supplier Ledger", checked: true },
      { id: "sales_report", label: "Sales Report", checked: true },
    ],
  },
  {
    title: "Settings",
    permissions: [
      { id: "settings", label: "Settings", checked: true },
      { id: "backup", label: "Backup", checked: true },
    ],
  },
  {
    title: "Profile",
    permissions: [
      { id: "profile", label: "Profile", checked: true },
      { id: "change_password", label: "Change Password", checked: true },
    ],
  },
  {
    title: "Dashboard",
    permissions: [
      { id: "today_sold", label: "Today Sold", checked: true },
      { id: "dashboard", label: "Dashboard", checked: true },
      { id: "sms_api", label: "SMS API Notification", checked: true },
      { id: "today_expense", label: "Today Expense", checked: true },
      { id: "today_profit", label: "Today Profit", checked: true },
      { id: "current_month_sold", label: "Current Month Sold", checked: true },
      { id: "current_month_expense", label: "Current Month Expense", checked: true },
      { id: "current_month_purchase", label: "Current Month Purchase", checked: true },
      { id: "current_month_return", label: "Current Month Return", checked: true },
      { id: "current_month_profit", label: "Current Month Profit", checked: true },
      { id: "total_sold", label: "Total Sold", checked: true },
      { id: "total_expense", label: "Total Expense", checked: true },
      { id: "total_purchase", label: "Total Purchase", checked: true },
      { id: "total_return", label: "Total Return", checked: true },
      { id: "total_profit", label: "Total Profit", checked: true },
      { id: "sales_purchase_chart", label: "Sales Purchase Chart", checked: true },
      { id: "top_sold_products", label: "Top Sold Products", checked: true },
      { id: "total_customer", label: "Total Customer", checked: true },
      { id: "total_supplier", label: "Total Supplier", checked: true },
      { id: "total_invoice", label: "Total Invoice", checked: true },
      { id: "total_product", label: "Total Product", checked: true },
    ],
  },
  {
    title: "Assets",
    permissions: [
      { id: "create_assets", label: "Create Assets", checked: true },
      { id: "edit_assets", label: "Edit Assets", checked: true },
      { id: "view_assets", label: "View Assets", checked: true },
      { id: "delete_assets", label: "Delete Assets", checked: true },
    ],
  },
];

const Permissions = () => {
  const [activeTab, setActiveTab] = useState("permissions");
  const [permissions, setPermissions] = useState(initialPermissions);
  const [selectAll, setSelectAll] = useState(true);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setPermissions((prev) =>
      prev.map((section) => ({
        ...section,
        permissions: section.permissions.map((p) => ({ ...p, checked })),
      }))
    );
  };

  const handleSelectSection = (sectionIndex: number, checked: boolean) => {
    setPermissions((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              permissions: section.permissions.map((p) => ({ ...p, checked })),
            }
          : section
      )
    );
  };

  const handlePermissionChange = (
    sectionIndex: number,
    permissionId: string,
    checked: boolean
  ) => {
    setPermissions((prev) =>
      prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              permissions: section.permissions.map((p) =>
                p.id === permissionId ? { ...p, checked } : p
              ),
            }
          : section
      )
    );
  };

  const isSectionFullySelected = (section: PermissionSection) =>
    section.permissions.every((p) => p.checked);

  const handleUpdatePermissions = () => {
    console.log("Updating permissions:", permissions);
    // This would typically save to a database
  };

  return (
    <DashboardLayout title="Permissions">
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-primary">Permissions</h1>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="roles"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Users className="w-4 h-4" />
              ROLES
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-4 py-3 text-sm gap-2"
            >
              <Shield className="w-4 h-4" />
              + PERMISSIONS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="mt-0">
            <div className="text-center py-12 text-muted-foreground">
              Roles management will be displayed here
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="mt-0 space-y-6">
            {/* Header with Select All */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-semibold">
                Update - <span className="text-primary">admin</span> -
                Permissions
              </h2>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked as boolean)
                  }
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All
                </label>
              </div>
            </div>

            {/* Permission Sections Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {permissions.map((section, sectionIndex) => (
                <div
                  key={section.title}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
                    <h3 className="font-semibold text-primary">
                      {section.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`section-${sectionIndex}`}
                        checked={isSectionFullySelected(section)}
                        onCheckedChange={(checked) =>
                          handleSelectSection(sectionIndex, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`section-${sectionIndex}`}
                        className="text-sm text-muted-foreground cursor-pointer"
                      >
                        Select Section
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {section.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center gap-2"
                      >
                        <Checkbox
                          id={permission.id}
                          checked={permission.checked}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(
                              sectionIndex,
                              permission.id,
                              checked as boolean
                            )
                          }
                        />
                        <label
                          htmlFor={permission.id}
                          className="text-sm cursor-pointer"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Update Button */}
            <div className="pt-4">
              <Button onClick={handleUpdatePermissions} size="lg">
                Update Permissions
              </Button>
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

export default Permissions;
