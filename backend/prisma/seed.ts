import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

// All permission keys from your admin panel
const PERMISSIONS = [
  { key: "add_bank_account", name: "Add Bank Account", module: "Bank Account" },
  { key: "add_brand", name: "Add Brand", module: "Brand" },
  { key: "add_category", name: "Add Category", module: "Category" },
  { key: "add_customer", name: "Add Customer", module: "Customer" },
  { key: "add_damage", name: "Add Damage", module: "Damage" },
  { key: "add_employee", name: "Add Employee", module: "Employee" },
  { key: "add_estimate", name: "Add Estimate", module: "Estimate" },
  { key: "add_expense", name: "Add Expense", module: "Expense" },
  {
    key: "add_expense_category",
    name: "Add Expense Category",
    module: "Expense Category",
  },
  { key: "add_owner", name: "Add Owner", module: "Owner" },
  { key: "add_payment", name: "Add Payment", module: "Payment" },
  { key: "add_product", name: "Add Product", module: "Product" },
  { key: "add_purchase", name: "Add Purchase", module: "Purchase" },
  { key: "add_sale", name: "Add Sale", module: "POS" },
  { key: "add_sms", name: "Add SMS", module: "SMS" },
  { key: "add_supplier", name: "Add Supplier", module: "Supplier" },
  { key: "add_unit", name: "Add Unit", module: "Unit" },
  { key: "add_user", name: "Add User", module: "User" },
  { key: "backup", name: "Backup", module: "Settings" },
  {
    key: "bank_account_delete",
    name: "Bank Account Delete",
    module: "Bank Account",
  },
  {
    key: "bank_account_list",
    name: "Bank Account List",
    module: "Bank Account",
  },
  {
    key: "bank_account_transfer",
    name: "Bank Account Transfer",
    module: "Bank Account",
  },
  {
    key: "bank_account_withdraw",
    name: "Bank Account Withdraw",
    module: "Bank Account",
  },
  { key: "barcode_add_stock", name: "Barcode Add Stock", module: "Product" },
  { key: "brands", name: "Brands", module: "Brand" },
  { key: "cash_book", name: "Cash Book", module: "Cash Book" },
  {
    key: "category_wise_report",
    name: "Category Wise Report",
    module: "Report",
  },
  { key: "change_password", name: "Change Password", module: "Profile" },
  { key: "create_assets", name: "Create Assets", module: "Assets" },
  {
    key: "create_bank_deposit",
    name: "Create Bank Deposit",
    module: "Bank Account",
  },
  { key: "create_category", name: "Create Category", module: "Category" },
  { key: "create_customer", name: "Create Customer", module: "Customer" },
  { key: "create_damage", name: "Create Damage", module: "Damage" },
  { key: "create_employee", name: "Create Employee", module: "Employee" },
  { key: "create_expense", name: "Create Expense", module: "Expense" },
  {
    key: "create_expense_category",
    name: "Create Expense Category",
    module: "Expense Category",
  },
  { key: "create_payment", name: "Create Payment", module: "Payment" },
  { key: "create_product", name: "Create Product", module: "Product" },
  { key: "create_purchase", name: "Create Purchase", module: "Purchase" },
  { key: "create_sms", name: "Create SMS", module: "SMS" },
  { key: "create_supplier", name: "Create Supplier", module: "Supplier" },
  { key: "create_user", name: "Create User", module: "User" },
  {
    key: "current_month_expense",
    name: "Current Month Expense",
    module: "Dashboard",
  },
  {
    key: "current_month_profit",
    name: "Current Month Profit",
    module: "Dashboard",
  },
  {
    key: "current_month_purchase",
    name: "Current Month Purchase",
    module: "Dashboard",
  },
  {
    key: "current_month_report",
    name: "Current Month Report",
    module: "Report",
  },
  {
    key: "current_month_return",
    name: "Current Month Return",
    module: "Dashboard",
  },
  {
    key: "current_month_sold",
    name: "Current Month Sold",
    module: "Dashboard",
  },
  { key: "customer_due_report", name: "Customer Due Report", module: "Report" },
  { key: "customer_ledger", name: "Customer Ledger", module: "Customer" },
  {
    key: "customer_ledger_report",
    name: "Customer Ledger Report",
    module: "Report",
  },
  {
    key: "customer_make_payment",
    name: "Customer Make Payment",
    module: "Customer",
  },
  { key: "daily_report", name: "Daily Report", module: "Report" },
  { key: "dashboard", name: "Dashboard", module: "Dashboard" },
  { key: "delete_assets", name: "Delete Assets", module: "Assets" },
  { key: "delete_brand", name: "Delete Brand", module: "Brand" },
  { key: "delete_category", name: "Delete Category", module: "Category" },
  { key: "delete_customer", name: "Delete Customer", module: "Customer" },
  { key: "delete_damage", name: "Delete Damage", module: "Damage" },
  { key: "delete_employee", name: "Delete Employee", module: "Employee" },
  { key: "delete_estimate", name: "Delete Estimate", module: "Estimate" },
  { key: "delete_expense", name: "Delete Expense", module: "Expense" },
  {
    key: "delete_expense_category",
    name: "Delete Expense Category",
    module: "Expense Category",
  },
  { key: "delete_owner", name: "Delete Owner", module: "Owner" },
  { key: "delete_payment", name: "Delete Payment", module: "Payment" },
  { key: "delete_product", name: "Delete Product", module: "Product" },
  { key: "delete_return", name: "Delete Return", module: "Return" },
  { key: "delete_sms", name: "Delete SMS", module: "SMS" },
  { key: "delete_supplier", name: "Delete Supplier", module: "Supplier" },
  { key: "delete_user", name: "Delete User", module: "User" },
  { key: "edit_assets", name: "Edit Assets", module: "Assets" },
  { key: "edit_brand", name: "Edit Brand", module: "Brand" },
  { key: "edit_category", name: "Edit Category", module: "Category" },
  { key: "edit_customer", name: "Edit Customer", module: "Customer" },
  { key: "edit_discount", name: "Edit Discount", module: "POS" },
  { key: "edit_employee", name: "Edit Employee", module: "Employee" },
  { key: "edit_estimate", name: "Edit Estimate", module: "Estimate" },
  { key: "edit_expense", name: "Edit Expense", module: "Expense" },
  {
    key: "edit_expense_category",
    name: "Edit Expense Category",
    module: "Expense Category",
  },
  { key: "edit_owner", name: "Edit Owner", module: "Owner" },
  { key: "edit_product", name: "Edit Product", module: "Product" },
  { key: "edit_purchase", name: "Edit Purchase", module: "Purchase" },
  { key: "edit_sale_payment", name: "Edit Sale Payment", module: "POS" },
  { key: "edit_sms", name: "Edit SMS", module: "SMS" },
  { key: "edit_supplier", name: "Edit Supplier", module: "Supplier" },
  { key: "edit_unit", name: "Edit Unit", module: "Unit" },
  { key: "edit_user", name: "Edit User", module: "User" },
  { key: "employee_salary", name: "Employee Salary", module: "Employee" },
  { key: "list_return", name: "List Return", module: "Return" },
  { key: "low_stock_report", name: "Low Stock Report", module: "Report" },
  { key: "owner_list", name: "Owner List", module: "Owner" },
  { key: "pos_add_customer", name: "POS Add Customer", module: "POS" },
  { key: "pos_duplicate_sale", name: "POS Duplicate Sale", module: "POS" },
  { key: "pos_refund_sale", name: "POS Refund Sale", module: "POS" },
  {
    key: "product_add_category",
    name: "Product Add Category",
    module: "Product",
  },
  { key: "profile", name: "Profile", module: "Profile" },
  { key: "profit_loss_report", name: "Profit Loss Report", module: "Report" },
  {
    key: "promotional_sms",
    name: "Promotional SMS",
    module: "Promotional Sms",
  },
  {
    key: "purchase_add_payment",
    name: "Purchase Add Payment",
    module: "Purchase",
  },
  {
    key: "purchase_add_supplier",
    name: "Purchase Add Supplier",
    module: "Purchase",
  },
  { key: "purchase_receipt", name: "Purchase Receipt", module: "Purchase" },
  { key: "purchase_report", name: "Purchase Report", module: "Report" },
  { key: "sale_receipt", name: "Sale Receipt", module: "POS" },
  { key: "sale_trip", name: "Sale Trip", module: "POS" },
  { key: "sales_list", name: "Sales List", module: "POS" },
  {
    key: "sales_purchase_chart",
    name: "Sales Purchase Chart",
    module: "Dashboard",
  },
  { key: "sales_report", name: "Sales Report", module: "Report" },
  { key: "settings", name: "Settings", module: "Settings" },
  { key: "sms_api", name: "SMS API Notification", module: "Dashboard" },
  { key: "stock", name: "Stock", module: "Misc" },
  { key: "summary_report", name: "Summary Report", module: "Report" },
  { key: "supplier_due_report", name: "Supplier Due Report", module: "Report" },
  { key: "supplier_ledger", name: "Supplier Ledger", module: "Supplier" },
  {
    key: "supplier_ledger_report",
    name: "Supplier Ledger Report",
    module: "Report",
  },
  {
    key: "supplier_make_payment",
    name: "Supplier Make Payment",
    module: "Supplier",
  },
  { key: "today_expense", name: "Today Expense", module: "Dashboard" },
  { key: "today_profit", name: "Today Profit", module: "Dashboard" },
  { key: "today_sold", name: "Today Sold", module: "Dashboard" },
  { key: "top_customer_report", name: "Top Customer Report", module: "Report" },
  {
    key: "top_product_all_time_report",
    name: "Top Product All Time Report",
    module: "Report",
  },
  { key: "top_product_report", name: "Top Product Report", module: "Report" },
  { key: "top_sold_products", name: "Top Sold Products", module: "Dashboard" },
  { key: "total_customer", name: "Total Customer", module: "Dashboard" },
  { key: "total_expense", name: "Total Expense", module: "Dashboard" },
  { key: "total_invoice", name: "Total Invoice", module: "Dashboard" },
  { key: "total_product", name: "Total Product", module: "Dashboard" },
  { key: "total_profit", name: "Total Profit", module: "Dashboard" },
  { key: "total_purchase", name: "Total Purchase", module: "Dashboard" },
  { key: "total_return", name: "Total Return", module: "Dashboard" },
  { key: "total_sold", name: "Total Sold", module: "Dashboard" },
  { key: "total_supplier", name: "Total Supplier", module: "Dashboard" },
  { key: "units", name: "Units", module: "Unit" },
  { key: "update_sell_price", name: "Update Sell Price", module: "Product" },
  { key: "view_assets", name: "View Assets", module: "Assets" },
  { key: "view_damage", name: "View Damage", module: "Damage" },
  { key: "view_estimate", name: "View Estimate", module: "Estimate" },
  { key: "view_payment", name: "View Payment", module: "Payment" },
  { key: "view_purchase", name: "View Purchase", module: "Purchase" },
  { key: "view_sale", name: "View Sale", module: "POS" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create permissions
  console.log("Creating permissions...");
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: perm.key },
      update: {},
      create: perm,
    });
  }

  // Create roles
  console.log("Creating roles...");
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Administrator with full access",
      isSystem: true,
    },
  });

  const staffRole = await prisma.role.upsert({
    where: { name: "STAFF" },
    update: {},
    create: {
      name: "STAFF",
      description: "Staff member with limited access",
      isSystem: true,
    },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: "CASHIER" },
    update: {},
    create: {
      name: "CASHIER",
      description: "Cashier for POS operations",
      isSystem: true,
    },
  });

  // Assign all permissions to admin
  const allPermissions = await prisma.permission.findMany();
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // Assign limited permissions to staff/cashier
  const posPermissions = allPermissions.filter(
    (p) =>
      p.module === "POS" || p.module === "Customer" || p.module === "Product",
  );
  for (const perm of posPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: { roleId: cashierRole.id, permissionId: perm.id },
      },
      update: {},
      create: { roleId: cashierRole.id, permissionId: perm.id },
    });
  }

  // Create admin user
  console.log("Creating users...");
  const hashedPassword = await bcrypt.hash("admin", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@softghor.com" },
    update: {},
    create: {
      email: "admin@softghor.com",
      password: hashedPassword,
      name: "Admin User",
      phone: "01700000000",
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  // Create sample data
  console.log("Creating sample data...");

  // Base units
  const pc = await prisma.unit.upsert({
    where: { name: "pc" },
    update: { shortName: "pc" },
    create: { name: "pc", shortName: "pc" },
  });

  const gm = await prisma.unit.upsert({
    where: { name: "gm" },
    update: { shortName: "gm" },
    create: { name: "gm", shortName: "gm" },
  });

  const ml = await prisma.unit.upsert({
    where: { name: "ml" },
    update: { shortName: "ml" },
    create: { name: "ml", shortName: "ml" },
  });

  // Derived units
  const dozen = await prisma.unit.upsert({
    where: { name: "Dozen" },
    update: { shortName: "Dozen" },
    create: { name: "Dozen", shortName: "Dozen" },
  });

  const kg = await prisma.unit.upsert({
    where: { name: "Kg" },
    update: { shortName: "Kg" },
    create: { name: "Kg", shortName: "Kg" },
  });

  const litre = await prisma.unit.upsert({
    where: { name: "Litre" },
    update: { shortName: "Litre" },
    create: { name: "Litre", shortName: "Litre" },
  });

  const k1 = await prisma.unit.upsert({
    where: { name: "k1" },
    update: { shortName: "k1" },
    create: { name: "k1", shortName: "k1" },
  });

  const kilo = await prisma.unit.upsert({
    where: { name: "kilo" },
    update: { shortName: "kilo" },
    create: { name: "kilo", shortName: "kilo" },
  });

  // Conversions (one per derived unit)
  await prisma.unitConversion.upsert({
    where: { unitId: dozen.id },
    update: { relatedToId: pc.id, sign: "*", factor: "12" },
    create: { unitId: dozen.id, relatedToId: pc.id, sign: "*", factor: "12" },
  });

  await prisma.unitConversion.upsert({
    where: { unitId: kg.id },
    update: { relatedToId: gm.id, sign: "*", factor: "1000" },
    create: { unitId: kg.id, relatedToId: gm.id, sign: "*", factor: "1000" },
  });

  await prisma.unitConversion.upsert({
    where: { unitId: litre.id },
    update: { relatedToId: ml.id, sign: "*", factor: "1000" },
    create: {
      unitId: litre.id,
      relatedToId: ml.id,
      sign: "*",
      factor: "1000",
    },
  });

  await prisma.unitConversion.upsert({
    where: { unitId: kilo.id },
    update: { relatedToId: gm.id, sign: "*", factor: "1000" },
    create: { unitId: kilo.id, relatedToId: gm.id, sign: "*", factor: "1000" },
  });

  // Brand & Category
  const brand = await prisma.brand.upsert({
    where: { name: "Generic" },
    update: {},
    create: { name: "Generic" },
  });

  const category = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics", code: "ELEC" },
  });

  // Create products
  for (let i = 1; i <= 10; i++) {
    await prisma.product.upsert({
      where: { productCode: `PRD-00${i}` },
      update: {},
      create: {
        name: `Product ${i}`,
        productCode: `PRD-00${i}`,
        barcode: `890123456789${i}`,
        costPrice: 100 * i,
        sellPrice: 150 * i,
        categoryId: category.id,
        brandId: brand.id,
        unitId: pc.id, // ✅ fixed
      },
    });
  }

  // Create suppliers and customers
  await prisma.supplier.upsert({
    where: { id: "seed-supplier-1" },
    update: {},
    create: {
      id: "seed-supplier-1",
      name: "ABC Suppliers",
      phone: "01711111111",
      email: "abc@supplier.com",
    },
  });

  await prisma.customer.upsert({
    where: { id: "seed-customer-1" },
    update: {},
    create: {
      id: "seed-customer-1",
      name: "Walk-in Customer",
      phone: "01722222222",
    },
  });

  console.log("✅ Seeding complete!");
  console.log("Admin login: admin@softghor.com / admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
