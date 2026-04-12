// prisma/seed.ts
import {
  PrismaClient,
  Prisma,
  PaymentMethod,
  PaymentStatus,
  PurchaseStatus,
  SaleStatus,
  StockLedgerType,
  StockLedgerSource,
  SupplierLedgerType,
  CustomerLedgerType,
  CashBookType,
  CashBookSource,
  BankTransactionType,
} from "@prisma/client";
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
  {
    key: "supplier_due_report",
    name: "Supplier Due Report",
    module: "Report",
  },
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

function dec(v: string | number) {
  return new Prisma.Decimal(v);
}

async function main() {
  console.log("🌱 FULL DEMO Seeding...");

  // -----------------------
  // 1) Permissions
  // -----------------------
  console.log("1) Permissions...");
  await prisma.$transaction(
    PERMISSIONS.map((perm) =>
      prisma.permission.upsert({
        where: { key: perm.key },
        update: { name: perm.name, module: perm.module },
        create: perm,
      }),
    ),
  );

  // -----------------------
  // 2) Roles
  // -----------------------
  console.log("2) Roles...");
  const [adminRole, staffRole, cashierRole] = await prisma.$transaction([
    prisma.role.upsert({
      where: { name: "ADMIN" },
      update: { description: "Administrator with full access", isSystem: true },
      create: {
        name: "ADMIN",
        description: "Administrator with full access",
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: "STAFF" },
      update: {
        description: "Staff member with limited access",
        isSystem: true,
      },
      create: {
        name: "STAFF",
        description: "Staff member with limited access",
        isSystem: true,
      },
    }),
    prisma.role.upsert({
      where: { name: "CASHIER" },
      update: { description: "Cashier for POS operations", isSystem: true },
      create: {
        name: "CASHIER",
        description: "Cashier for POS operations",
        isSystem: true,
      },
    }),
  ]);

  console.log("2.1) Default branch...");
  const mainBranch = await prisma.branch.upsert({
    where: { code: "MAIN" },
    update: {
      name: "Main Branch",
      phone: "01700000000",
      address: "Dhaka, Bangladesh",
      isActive: true,
    },
    create: {
      name: "Main Branch",
      code: "MAIN",
      phone: "01700000000",
      address: "Dhaka, Bangladesh",
      isActive: true,
    },
  });

  console.log("   Role permissions...");
  const allPermissions = await prisma.permission.findMany();

  // Admin = all
  await prisma.$transaction(
    allPermissions.map((p) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: adminRole.id, permissionId: p.id },
        },
        update: {},
        create: { roleId: adminRole.id, permissionId: p.id },
      }),
    ),
  );

  // Staff = Dashboard + Report + Product + Customer + Supplier + Purchase + Expense
  const staffModules = new Set([
    "Dashboard",
    "Report",
    "Product",
    "Customer",
    "Supplier",
    "Purchase",
    "Expense",
    "Expense Category",
  ]);
  const staffPerms = allPermissions.filter((p) =>
    staffModules.has(p.module ?? ""),
  );
  await prisma.$transaction(
    staffPerms.map((p) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: staffRole.id, permissionId: p.id },
        },
        update: {},
        create: { roleId: staffRole.id, permissionId: p.id },
      }),
    ),
  );

  // Cashier = POS + Customer + Product
  const cashierModules = new Set(["POS", "Customer", "Product"]);
  const cashierPerms = allPermissions.filter((p) =>
    cashierModules.has(p.module ?? ""),
  );
  await prisma.$transaction(
    cashierPerms.map((p) =>
      prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: cashierRole.id, permissionId: p.id },
        },
        update: {},
        create: { roleId: cashierRole.id, permissionId: p.id },
      }),
    ),
  );

  // -----------------------
  // 3) Users
  // -----------------------
  console.log("3) Users...");
  const [adminUser, staffUser, cashierUser] = await prisma.$transaction([
    prisma.user.upsert({
      where: { email: "admin@softghor.com" },
      update: { name: "Admin User", phone: "01700000000", isActive: true },
      create: {
        email: "admin@softghor.com",
        password: await bcrypt.hash("admin", 10),
        name: "Admin User",
        phone: "01700000000",
      },
    }),
    prisma.user.upsert({
      where: { email: "staff@softghor.com" },
      update: { name: "Staff User", phone: "01700000001", isActive: true },
      create: {
        email: "staff@softghor.com",
        password: await bcrypt.hash("staff", 10),
        name: "Staff User",
        phone: "01700000001",
      },
    }),
    prisma.user.upsert({
      where: { email: "cashier@softghor.com" },
      update: { name: "Cashier User", phone: "01700000002", isActive: true },
      create: {
        email: "cashier@softghor.com",
        password: await bcrypt.hash("cashier", 10),
        name: "Cashier User",
        phone: "01700000002",
      },
    }),
  ]);

  await prisma.$transaction([
    prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: adminUser.id, roleId: adminRole.id },
      },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    }),
    prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: staffUser.id, roleId: staffRole.id },
      },
      update: {},
      create: { userId: staffUser.id, roleId: staffRole.id },
    }),
    prisma.userRole.upsert({
      where: {
        userId_roleId: { userId: cashierUser.id, roleId: cashierRole.id },
      },
      update: {},
      create: { userId: cashierUser.id, roleId: cashierRole.id },
    }),
  ]);

  await prisma.$transaction([
    prisma.userBranch.upsert({
      where: { userId_branchId: { userId: adminUser.id, branchId: mainBranch.id } },
      update: { isDefault: true },
      create: { userId: adminUser.id, branchId: mainBranch.id, isDefault: true },
    }),
    prisma.userBranch.upsert({
      where: { userId_branchId: { userId: staffUser.id, branchId: mainBranch.id } },
      update: { isDefault: true },
      create: { userId: staffUser.id, branchId: mainBranch.id, isDefault: true },
    }),
    prisma.userBranch.upsert({
      where: { userId_branchId: { userId: cashierUser.id, branchId: mainBranch.id } },
      update: { isDefault: true },
      create: { userId: cashierUser.id, branchId: mainBranch.id, isDefault: true },
    }),
  ]);

  // -----------------------
  // 4) Owner
  // -----------------------
  console.log("4) Owner...");
  await prisma.owner.upsert({
    where: { id: "seed-owner-1" },
    update: {
      name: "SoftGhor Owner",
      email: "owner@softghor.com",
      phone: "01733333333",
      address: "Dhaka, Bangladesh",
      nid: "1234567890",
    },
    create: {
      id: "seed-owner-1",
      name: "SoftGhor Owner",
      email: "owner@softghor.com",
      phone: "01733333333",
      address: "Dhaka, Bangladesh",
      nid: "1234567890",
    },
  });

  // -----------------------
  // 5) Units + UnitConversion
  // -----------------------
  console.log("5) Units...");
  const [pc, gm, ml, dozen, kg, litre] = await prisma.$transaction([
    prisma.unit.upsert({
      where: { name: "pc" },
      update: { shortName: "pc" },
      create: { name: "pc", shortName: "pc" },
    }),
    prisma.unit.upsert({
      where: { name: "gm" },
      update: { shortName: "gm" },
      create: { name: "gm", shortName: "gm" },
    }),
    prisma.unit.upsert({
      where: { name: "ml" },
      update: { shortName: "ml" },
      create: { name: "ml", shortName: "ml" },
    }),
    prisma.unit.upsert({
      where: { name: "Dozen" },
      update: { shortName: "Dozen" },
      create: { name: "Dozen", shortName: "Dozen" },
    }),
    prisma.unit.upsert({
      where: { name: "Kg" },
      update: { shortName: "Kg" },
      create: { name: "Kg", shortName: "Kg" },
    }),
    prisma.unit.upsert({
      where: { name: "Litre" },
      update: { shortName: "Litre" },
      create: { name: "Litre", shortName: "Litre" },
    }),
  ]);

  await prisma.$transaction([
    prisma.unitConversion.upsert({
      where: { unitId: dozen.id },
      update: { relatedToId: pc.id, sign: "*", factor: dec("12") },
      create: {
        unitId: dozen.id,
        relatedToId: pc.id,
        sign: "*",
        factor: dec("12"),
      },
    }),
    prisma.unitConversion.upsert({
      where: { unitId: kg.id },
      update: { relatedToId: gm.id, sign: "*", factor: dec("1000") },
      create: {
        unitId: kg.id,
        relatedToId: gm.id,
        sign: "*",
        factor: dec("1000"),
      },
    }),
    prisma.unitConversion.upsert({
      where: { unitId: litre.id },
      update: { relatedToId: ml.id, sign: "*", factor: dec("1000") },
      create: {
        unitId: litre.id,
        relatedToId: ml.id,
        sign: "*",
        factor: dec("1000"),
      },
    }),
  ]);

  // -----------------------
  // 6) Brands + Categories + Subcategories
  // -----------------------
  console.log("6) Brand/Category/Subcategory...");
  const brandGeneric = await prisma.brand.upsert({
    where: { name: "Generic" },
    update: { description: "Generic brand" },
    create: { name: "Generic", description: "Generic brand" },
  });

  const brandAci = await prisma.brand.upsert({
    where: { name: "ACI" },
    update: { description: "ACI Limited" },
    create: { name: "ACI", description: "ACI Limited" },
  });

  const catGrocery = await prisma.category.upsert({
    where: { name: "Grocery" },
    update: { code: "GROC" },
    create: { name: "Grocery", code: "GROC" },
  });

  const catElectronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: { code: "ELEC" },
    create: { name: "Electronics", code: "ELEC" },
  });

  const [subRice, subOil, subMobile] = await prisma.$transaction([
    prisma.subcategory.upsert({
      where: { code: "RICE" },
      update: { name: "Rice", categoryId: catGrocery.id },
      create: { name: "Rice", code: "RICE", categoryId: catGrocery.id },
    }),
    prisma.subcategory.upsert({
      where: { code: "OIL" },
      update: { name: "Cooking Oil", categoryId: catGrocery.id },
      create: {
        name: "Cooking Oil",
        code: "OIL",
        categoryId: catGrocery.id,
      },
    }),
    prisma.subcategory.upsert({
      where: { code: "MOB" },
      update: { name: "Mobile", categoryId: catElectronics.id },
      create: { name: "Mobile", code: "MOB", categoryId: catElectronics.id },
    }),
  ]);

  // -----------------------
  // 7) Products
  // -----------------------
  console.log("7) Products...");
  const productSeeds = [
    {
      productCode: "PRD-001",
      name: "Miniket Rice 25kg",
      barcode: "8901234567891",
      costPrice: dec("1650"),
      sellPrice: dec("1850"),
      unitId: kg.id,
      categoryId: catGrocery.id,
      subcategoryId: subRice.id,
      brandId: brandGeneric.id,
      alertQuantity: 5,
      description: "Seed demo product",
    },
    {
      productCode: "PRD-002",
      name: "Soybean Oil 5L",
      barcode: "8901234567892",
      costPrice: dec("750"),
      sellPrice: dec("820"),
      unitId: litre.id,
      categoryId: catGrocery.id,
      subcategoryId: subOil.id,
      brandId: brandAci.id,
      alertQuantity: 10,
      description: "Seed demo product",
    },
    {
      productCode: "PRD-003",
      name: "USB Cable",
      barcode: "8901234567893",
      costPrice: dec("45"),
      sellPrice: dec("80"),
      unitId: pc.id,
      categoryId: catElectronics.id,
      subcategoryId: subMobile.id,
      brandId: brandGeneric.id,
      alertQuantity: 20,
      description: "Seed demo product",
    },
    {
      productCode: "PRD-004",
      name: "Feature Phone",
      barcode: "8901234567894",
      costPrice: dec("850"),
      sellPrice: dec("999"),
      unitId: pc.id,
      categoryId: catElectronics.id,
      subcategoryId: subMobile.id,
      brandId: brandGeneric.id,
      alertQuantity: 3,
      description: "Seed demo product",
    },
  ];

  for (const p of productSeeds) {
    await prisma.product.upsert({
      where: { productCode: p.productCode },
      update: {
        name: p.name,
        barcode: p.barcode,
        description: p.description,
        costPrice: p.costPrice,
        sellPrice: p.sellPrice,
        alertQuantity: p.alertQuantity,
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        brandId: p.brandId,
        unitId: p.unitId,
      },
      create: {
        name: p.name,
        productCode: p.productCode,
        barcode: p.barcode,
        description: p.description,
        costPrice: p.costPrice,
        sellPrice: p.sellPrice,
        alertQuantity: p.alertQuantity,
        categoryId: p.categoryId,
        subcategoryId: p.subcategoryId,
        brandId: p.brandId,
        unitId: p.unitId,
      },
    });
  }

  const products = await prisma.product.findMany({
    where: { productCode: { in: productSeeds.map((x) => x.productCode) } },
  });

  const p1 = products.find((p) => p.productCode === "PRD-001")!;
  const p2 = products.find((p) => p.productCode === "PRD-002")!;
  const p3 = products.find((p) => p.productCode === "PRD-003")!;
  const p4 = products.find((p) => p.productCode === "PRD-004")!;

  // -----------------------
  // 8) Supplier + Customer
  // -----------------------
  console.log("8) Supplier/Customer...");
  const supplier1 = await prisma.supplier.upsert({
    where: { id: "seed-supplier-1" },
    update: {
      name: "ABC Suppliers",
      phone: "01711111111",
      email: "abc@supplier.com",
      address: "Tejgaon, Dhaka",
      company: "ABC Trading",
      openingBalance: dec("2000"),
      createdById: adminUser.id,
    },
    create: {
      id: "seed-supplier-1",
      name: "ABC Suppliers",
      phone: "01711111111",
      email: "abc@supplier.com",
      address: "Tejgaon, Dhaka",
      company: "ABC Trading",
      openingBalance: dec("2000"),
      createdById: adminUser.id,
    },
  });

  const customer1 = await prisma.customer.upsert({
    where: { id: "seed-customer-1" },
    update: {
      name: "Walk-in Customer",
      phone: "01722222222",
      address: "Dhaka",
      openingBalance: dec("500"),
      createdById: adminUser.id,
    },
    create: {
      id: "seed-customer-1",
      name: "Walk-in Customer",
      phone: "01722222222",
      address: "Dhaka",
      openingBalance: dec("500"),
      createdById: adminUser.id,
    },
  });

  // -----------------------
  // 9) BankAccount
  // -----------------------
  console.log("9) BankAccount...");
  const bank1 = await prisma.bankAccount.upsert({
    where: { accountNumber: "012345678901" },
    update: {
      bankName: "DBBL",
      accountName: "SoftGhor Main",
      branch: "Kaliganj",
      openingBalance: dec("50000"),
      currentBalance: dec("50000"),
    },
    create: {
      bankName: "DBBL",
      accountName: "SoftGhor Main",
      accountNumber: "012345678901",
      branch: "Kaliganj",
      openingBalance: dec("50000"),
      currentBalance: dec("50000"),
    },
  });

  // -----------------------
  // 10) Expense Category + Expense
  // -----------------------
  console.log("10) Expense...");
  const expCat1 = await prisma.expenseCategory.upsert({
    where: { name: "Office" },
    update: { description: "Office related expenses" },
    create: { name: "Office", description: "Office related expenses" },
  });

  await prisma.expense.upsert({
    where: { id: "seed-expense-1" },
    update: {
      expenseCategoryId: expCat1.id,
      amount: dec("350"),
      paymentMethod: PaymentMethod.CASH,
      description: "Stationery purchase",
      reference: "EXP-0001",
      expenseDate: new Date(),
    },
    create: {
      id: "seed-expense-1",
      expenseCategoryId: expCat1.id,
      amount: dec("350"),
      paymentMethod: PaymentMethod.CASH,
      description: "Stationery purchase",
      reference: "EXP-0001",
      expenseDate: new Date(),
    },
  });

  // -----------------------
  // 11) Employee + SalaryPayment
  // -----------------------
  console.log("11) Employee/Salary...");
  const emp1 = await prisma.employee.upsert({
    where: { id: "seed-employee-1" },
    update: {
      name: "Rahim",
      phone: "01744444444",
      designation: "Sales Executive",
      department: "Sales",
      basicSalary: dec("12000"),
      joinDate: new Date(),
    },
    create: {
      id: "seed-employee-1",
      name: "Rahim",
      phone: "01744444444",
      designation: "Sales Executive",
      department: "Sales",
      basicSalary: dec("12000"),
      joinDate: new Date(),
    },
  });

  const now = new Date();
  await prisma.salaryPayment.upsert({
    where: {
      employeeId_month_year: {
        employeeId: emp1.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    },
    update: {
      basicSalary: dec("12000"),
      overtime: dec("500"),
      bonus: dec("300"),
      deduction: dec("0"),
      netSalary: dec("12800"),
      paymentMethod: PaymentMethod.CASH,
      note: "Seed salary payment",
      paymentDate: new Date(),
    },
    create: {
      employeeId: emp1.id,
      basicSalary: dec("12000"),
      overtime: dec("500"),
      bonus: dec("300"),
      deduction: dec("0"),
      netSalary: dec("12800"),
      paymentMethod: PaymentMethod.CASH,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      note: "Seed salary payment",
      paymentDate: new Date(),
    },
  });

  // -----------------------
  // 12) Asset
  // -----------------------
  console.log("12) Asset...");
  await prisma.asset.upsert({
    where: { id: "seed-asset-1" },
    update: {
      name: "Laptop",
      description: "Office laptop",
      purchasePrice: dec("55000"),
      currentValue: dec("48000"),
      purchaseDate: new Date(),
      location: "Office",
      serialNumber: "LAP-001",
    },
    create: {
      id: "seed-asset-1",
      name: "Laptop",
      description: "Office laptop",
      purchasePrice: dec("55000"),
      currentValue: dec("48000"),
      purchaseDate: new Date(),
      location: "Office",
      serialNumber: "LAP-001",
    },
  });

  // -----------------------
  // 13) Opening StockLedger (NO .catch in transaction)
  // -----------------------
  console.log("13) Opening stock...");
  const openingStocks: Array<{ productId: string; qty: number }> = [
    { productId: p1.id, qty: 20 },
    { productId: p2.id, qty: 30 },
    { productId: p3.id, qty: 200 },
    { productId: p4.id, qty: 10 },
  ];

  await prisma.$transaction(
    openingStocks.map((s, idx) =>
      prisma.stockLedger.upsert({
        where: { id: `seed-stock-open-${idx + 1}` },
        update: {
          productId: s.productId,
          type: StockLedgerType.IN,
          source: StockLedgerSource.OPENING,
          referenceId: "OPENING",
          quantity: s.qty,
          note: "Opening stock",
          createdById: adminUser.id,
        },
        create: {
          id: `seed-stock-open-${idx + 1}`,
          productId: s.productId,
          type: StockLedgerType.IN,
          source: StockLedgerSource.OPENING,
          referenceId: "OPENING",
          quantity: s.qty,
          note: "Opening stock",
          createdById: adminUser.id,
        },
      }),
    ),
  );

  // -----------------------
  // 14) Purchase Flow
  // -----------------------
  console.log("14) Purchase...");
  const purchase = await prisma.purchase.upsert({
    where: { invoiceNo: "PUR-0001" },
    update: {
      supplierId: supplier1.id,
      userId: adminUser.id,
      subtotal: dec("3000"),
      discount: dec("100"),
      tax: dec("0"),
      shippingCost: dec("50"),
      total: dec("2950"),
      paidAmount: dec("1500"),
      dueAmount: dec("1450"),
      status: PurchaseStatus.RECEIVED,
      paymentStatus: PaymentStatus.PARTIAL,
      note: "Seed purchase",
      purchaseDate: new Date(),
    },
    create: {
      id: "seed-purchase-1",
      invoiceNo: "PUR-0001",
      supplierId: supplier1.id,
      userId: adminUser.id,
      subtotal: dec("3000"),
      discount: dec("100"),
      tax: dec("0"),
      shippingCost: dec("50"),
      total: dec("2950"),
      paidAmount: dec("1500"),
      dueAmount: dec("1450"),
      status: PurchaseStatus.RECEIVED,
      paymentStatus: PaymentStatus.PARTIAL,
      note: "Seed purchase",
      purchaseDate: new Date(),
    },
  });

  await prisma.purchaseItem.createMany({
    data: [
      {
        id: "seed-pur-item-1",
        purchaseId: purchase.id,
        productId: p1.id,
        quantity: 1,
        unitPrice: dec("1650"),
        total: dec("1650"),
      },
      {
        id: "seed-pur-item-2",
        purchaseId: purchase.id,
        productId: p2.id,
        quantity: 2,
        unitPrice: dec("675"),
        total: dec("1350"),
      },
    ],
    skipDuplicates: true,
  });

  // Stock IN for purchase
  await prisma.$transaction([
    prisma.stockLedger.upsert({
      where: { id: "seed-stock-pur-1" },
      update: {
        productId: p1.id,
        type: StockLedgerType.IN,
        source: StockLedgerSource.PURCHASE,
        referenceId: purchase.id,
        quantity: 1,
        note: "Purchase received",
        createdById: adminUser.id,
      },
      create: {
        id: "seed-stock-pur-1",
        productId: p1.id,
        type: StockLedgerType.IN,
        source: StockLedgerSource.PURCHASE,
        referenceId: purchase.id,
        quantity: 1,
        note: "Purchase received",
        createdById: adminUser.id,
      },
    }),
    prisma.stockLedger.upsert({
      where: { id: "seed-stock-pur-2" },
      update: {
        productId: p2.id,
        type: StockLedgerType.IN,
        source: StockLedgerSource.PURCHASE,
        referenceId: purchase.id,
        quantity: 2,
        note: "Purchase received",
        createdById: adminUser.id,
      },
      create: {
        id: "seed-stock-pur-2",
        productId: p2.id,
        type: StockLedgerType.IN,
        source: StockLedgerSource.PURCHASE,
        referenceId: purchase.id,
        quantity: 2,
        note: "Purchase received",
        createdById: adminUser.id,
      },
    }),
  ]);

  // Supplier Ledger (running balance demo)
  const supplierOpening = dec("2000");
  const supplierAfterPurchase = supplierOpening.add(dec("1450"));
  const supplierAfterPayment = supplierAfterPurchase.sub(dec("1500"));

  await prisma.$transaction([
    prisma.supplierLedger.upsert({
      where: { id: "seed-sup-ledger-open" },
      update: {
        supplierId: supplier1.id,
        type: SupplierLedgerType.OPENING_BALANCE,
        referenceId: "OPENING",
        amount: supplierOpening,
        balance: supplierOpening,
        note: "Opening balance",
      },
      create: {
        id: "seed-sup-ledger-open",
        supplierId: supplier1.id,
        type: SupplierLedgerType.OPENING_BALANCE,
        referenceId: "OPENING",
        amount: supplierOpening,
        balance: supplierOpening,
        note: "Opening balance",
      },
    }),
    prisma.supplierLedger.upsert({
      where: { id: "seed-sup-ledger-pur" },
      update: {
        supplierId: supplier1.id,
        type: SupplierLedgerType.PURCHASE_DUE,
        referenceId: purchase.id,
        amount: dec("1450"),
        balance: supplierAfterPurchase,
        note: "Purchase due",
      },
      create: {
        id: "seed-sup-ledger-pur",
        supplierId: supplier1.id,
        type: SupplierLedgerType.PURCHASE_DUE,
        referenceId: purchase.id,
        amount: dec("1450"),
        balance: supplierAfterPurchase,
        note: "Purchase due",
      },
    }),
    prisma.supplierLedger.upsert({
      where: { id: "seed-sup-ledger-pay" },
      update: {
        supplierId: supplier1.id,
        type: SupplierLedgerType.PAYMENT,
        referenceId: purchase.id,
        amount: dec("1500"),
        balance: supplierAfterPayment,
        note: "Payment made",
      },
      create: {
        id: "seed-sup-ledger-pay",
        supplierId: supplier1.id,
        type: SupplierLedgerType.PAYMENT,
        referenceId: purchase.id,
        amount: dec("1500"),
        balance: supplierAfterPayment,
        note: "Payment made",
      },
    }),
  ]);

  await prisma.supplierPayment.upsert({
    where: { id: "seed-supplier-payment-1" },
    update: {
      supplierId: supplier1.id,
      amount: dec("1500"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      note: "Seed supplier payment",
      paymentDate: new Date(),
    },
    create: {
      id: "seed-supplier-payment-1",
      supplierId: supplier1.id,
      amount: dec("1500"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      note: "Seed supplier payment",
      paymentDate: new Date(),
    },
  });

  // Generic Payment (purchase)
  await prisma.payment.upsert({
    where: { id: "seed-payment-purchase-1" },
    update: {
      purchaseId: purchase.id,
      supplierId: supplier1.id,
      amount: dec("1500"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      note: "Seed payment for purchase",
      paymentDate: new Date(),
    },
    create: {
      id: "seed-payment-purchase-1",
      purchaseId: purchase.id,
      supplierId: supplier1.id,
      amount: dec("1500"),
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      note: "Seed payment for purchase",
      paymentDate: new Date(),
    },
  });

  // BankTransaction + update bank balance (decimal-safe)
  const bankAfterPurchase = bank1.currentBalance.sub(dec("1500"));

  await prisma.$transaction([
    prisma.bankTransaction.upsert({
      where: { id: "seed-bank-tx-1" },
      update: {
        bankAccountId: bank1.id,
        type: BankTransactionType.WITHDRAW,
        amount: dec("1500"),
        balanceAfter: bankAfterPurchase,
        referenceId: purchase.id,
        description: "Supplier payment for purchase PUR-0001",
        transactionDate: new Date(),
      },
      create: {
        id: "seed-bank-tx-1",
        bankAccountId: bank1.id,
        type: BankTransactionType.WITHDRAW,
        amount: dec("1500"),
        balanceAfter: bankAfterPurchase,
        referenceId: purchase.id,
        description: "Supplier payment for purchase PUR-0001",
        transactionDate: new Date(),
      },
    }),
    prisma.bankAccount.update({
      where: { id: bank1.id },
      data: { currentBalance: bankAfterPurchase },
    }),
    prisma.cashBook.upsert({
      where: { id: "seed-cashbook-purchase-1" },
      update: {
        type: CashBookType.OUT,
        source: CashBookSource.PURCHASE,
        referenceId: purchase.id,
        amount: dec("1500"),
        balance: dec("0"),
        description: "Purchase payment (bank transfer)",
        entryDate: new Date(),
      },
      create: {
        id: "seed-cashbook-purchase-1",
        type: CashBookType.OUT,
        source: CashBookSource.PURCHASE,
        referenceId: purchase.id,
        amount: dec("1500"),
        balance: dec("0"),
        description: "Purchase payment (bank transfer)",
        entryDate: new Date(),
      },
    }),
  ]);

  // -----------------------
  // 15) Sale Flow
  // -----------------------
  console.log("15) Sale...");
  const sale = await prisma.sale.upsert({
    where: { invoiceNo: "SAL-0001" },
    update: {
      customerId: customer1.id,
      userId: cashierUser.id,
      subtotal: dec("1160"),
      discount: dec("60"),
      discountType: "fixed",
      tax: dec("0"),
      total: dec("1100"),
      paidAmount: dec("1000"),
      dueAmount: dec("100"),
      changeAmount: dec("0"),
      status: SaleStatus.COMPLETED,
      paymentStatus: PaymentStatus.PARTIAL,
      paymentMethod: PaymentMethod.CASH,
      note: "Seed sale",
      saleDate: new Date(),
    },
    create: {
      id: "seed-sale-1",
      invoiceNo: "SAL-0001",
      customerId: customer1.id,
      userId: cashierUser.id,
      subtotal: dec("1160"),
      discount: dec("60"),
      discountType: "fixed",
      tax: dec("0"),
      total: dec("1100"),
      paidAmount: dec("1000"),
      dueAmount: dec("100"),
      changeAmount: dec("0"),
      status: SaleStatus.COMPLETED,
      paymentStatus: PaymentStatus.PARTIAL,
      paymentMethod: PaymentMethod.CASH,
      note: "Seed sale",
      saleDate: new Date(),
    },
  });

  await prisma.saleItem.createMany({
    data: [
      {
        id: "seed-sale-item-1",
        saleId: sale.id,
        productId: p3.id,
        quantity: 5,
        unitPrice: dec("80"),
        discount: dec("0"),
        total: dec("400"),
      },
      {
        id: "seed-sale-item-2",
        saleId: sale.id,
        productId: p2.id,
        quantity: 1,
        unitPrice: dec("820"),
        discount: dec("60"),
        total: dec("760"),
      },
    ],
    skipDuplicates: true,
  });

  // Stock OUT for sale
  await prisma.$transaction([
    prisma.stockLedger.upsert({
      where: { id: "seed-stock-sale-1" },
      update: {
        productId: p3.id,
        type: StockLedgerType.OUT,
        source: StockLedgerSource.SALE,
        referenceId: sale.id,
        quantity: 5,
        note: "Sale",
        createdById: cashierUser.id,
      },
      create: {
        id: "seed-stock-sale-1",
        productId: p3.id,
        type: StockLedgerType.OUT,
        source: StockLedgerSource.SALE,
        referenceId: sale.id,
        quantity: 5,
        note: "Sale",
        createdById: cashierUser.id,
      },
    }),
    prisma.stockLedger.upsert({
      where: { id: "seed-stock-sale-2" },
      update: {
        productId: p2.id,
        type: StockLedgerType.OUT,
        source: StockLedgerSource.SALE,
        referenceId: sale.id,
        quantity: 1,
        note: "Sale",
        createdById: cashierUser.id,
      },
      create: {
        id: "seed-stock-sale-2",
        productId: p2.id,
        type: StockLedgerType.OUT,
        source: StockLedgerSource.SALE,
        referenceId: sale.id,
        quantity: 1,
        note: "Sale",
        createdById: cashierUser.id,
      },
    }),
  ]);

  // Customer ledger demo (allow negative = advance)
  const customerOpening = dec("500");
  const customerAfterSaleDue = customerOpening.add(dec("100"));
  const customerAfterPayment = customerAfterSaleDue.sub(dec("1000"));

  await prisma.$transaction([
    prisma.customerLedger.upsert({
      where: { id: "seed-cus-ledger-open" },
      update: {
        customerId: customer1.id,
        type: CustomerLedgerType.OPENING_BALANCE,
        referenceId: "OPENING",
        amount: customerOpening,
        balance: customerOpening,
        note: "Opening balance",
      },
      create: {
        id: "seed-cus-ledger-open",
        customerId: customer1.id,
        type: CustomerLedgerType.OPENING_BALANCE,
        referenceId: "OPENING",
        amount: customerOpening,
        balance: customerOpening,
        note: "Opening balance",
      },
    }),
    prisma.customerLedger.upsert({
      where: { id: "seed-cus-ledger-sale" },
      update: {
        customerId: customer1.id,
        type: CustomerLedgerType.SALE_DUE,
        referenceId: sale.id,
        amount: dec("100"),
        balance: customerAfterSaleDue,
        note: "Sale due",
      },
      create: {
        id: "seed-cus-ledger-sale",
        customerId: customer1.id,
        type: CustomerLedgerType.SALE_DUE,
        referenceId: sale.id,
        amount: dec("100"),
        balance: customerAfterSaleDue,
        note: "Sale due",
      },
    }),
    prisma.customerLedger.upsert({
      where: { id: "seed-cus-ledger-pay" },
      update: {
        customerId: customer1.id,
        type: CustomerLedgerType.PAYMENT,
        referenceId: sale.id,
        amount: dec("1000"),
        balance: customerAfterPayment,
        note: "Payment received",
      },
      create: {
        id: "seed-cus-ledger-pay",
        customerId: customer1.id,
        type: CustomerLedgerType.PAYMENT,
        referenceId: sale.id,
        amount: dec("1000"),
        balance: customerAfterPayment,
        note: "Payment received",
      },
    }),
    prisma.customerPayment.upsert({
      where: { id: "seed-customer-payment-1" },
      update: {
        customerId: customer1.id,
        amount: dec("1000"),
        paymentMethod: PaymentMethod.CASH,
        note: "Seed customer payment",
        paymentDate: new Date(),
      },
      create: {
        id: "seed-customer-payment-1",
        customerId: customer1.id,
        amount: dec("1000"),
        paymentMethod: PaymentMethod.CASH,
        note: "Seed customer payment",
        paymentDate: new Date(),
      },
    }),
    prisma.payment.upsert({
      where: { id: "seed-payment-sale-1" },
      update: {
        saleId: sale.id,
        customerId: customer1.id,
        amount: dec("1000"),
        paymentMethod: PaymentMethod.CASH,
        note: "Seed payment for sale",
        paymentDate: new Date(),
      },
      create: {
        id: "seed-payment-sale-1",
        saleId: sale.id,
        customerId: customer1.id,
        amount: dec("1000"),
        paymentMethod: PaymentMethod.CASH,
        note: "Seed payment for sale",
        paymentDate: new Date(),
      },
    }),
    prisma.cashBook.upsert({
      where: { id: "seed-cashbook-sale-1" },
      update: {
        type: CashBookType.IN,
        source: CashBookSource.SALE,
        referenceId: sale.id,
        amount: dec("1000"),
        balance: dec("0"),
        description: "Sale cash received",
        entryDate: new Date(),
      },
      create: {
        id: "seed-cashbook-sale-1",
        type: CashBookType.IN,
        source: CashBookSource.SALE,
        referenceId: sale.id,
        amount: dec("1000"),
        balance: dec("0"),
        description: "Sale cash received",
        entryDate: new Date(),
      },
    }),
  ]);

  // -----------------------
  // 16) Return
  // -----------------------
  console.log("16) Return...");
  const ret = await prisma.return.upsert({
    where: { returnNo: "RET-0001" },
    update: { saleId: sale.id, total: dec("80"), note: "Returned 1 USB cable" },
    create: {
      id: "seed-return-1",
      returnNo: "RET-0001",
      saleId: sale.id,
      total: dec("80"),
      note: "Returned 1 USB cable",
      returnDate: new Date(),
    },
  });

  await prisma.returnItem.createMany({
    data: [
      {
        id: "seed-return-item-1",
        returnId: ret.id,
        productId: p3.id,
        quantity: 1,
        unitPrice: dec("80"),
        total: dec("80"),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.$transaction([
    prisma.stockLedger.upsert({
      where: { id: "seed-stock-return-1" },
      update: {
        productId: p3.id,
        type: StockLedgerType.IN,
        source: StockLedgerSource.RETURN,
        referenceId: ret.id,
        quantity: 1,
        note: "Sale return",
        createdById: cashierUser.id,
      },
      create: {
        id: "seed-stock-return-1",
        productId: p3.id,
        type: StockLedgerType.IN,
        source: StockLedgerSource.RETURN,
        referenceId: ret.id,
        quantity: 1,
        note: "Sale return",
        createdById: cashierUser.id,
      },
    }),
    prisma.customerLedger.upsert({
      where: { id: "seed-cus-ledger-return" },
      update: {
        customerId: customer1.id,
        type: CustomerLedgerType.RETURN_ADJUST,
        referenceId: ret.id,
        amount: dec("80"),
        balance: customerAfterPayment.sub(dec("80")),
        note: "Return adjust",
      },
      create: {
        id: "seed-cus-ledger-return",
        customerId: customer1.id,
        type: CustomerLedgerType.RETURN_ADJUST,
        referenceId: ret.id,
        amount: dec("80"),
        balance: customerAfterPayment.sub(dec("80")),
        note: "Return adjust",
      },
    }),
  ]);

  // -----------------------
  // 17) Estimate
  // -----------------------
  console.log("17) Estimate...");
  const est = await prisma.estimate.upsert({
    where: { estimateNo: "EST-0001" },
    update: {
      customerId: customer1.id,
      subtotal: dec("999"),
      discount: dec("0"),
      tax: dec("0"),
      total: dec("999"),
      note: "Seed estimate",
      validUntil: new Date(Date.now() + 7 * 24 * 3600 * 1000),
    },
    create: {
      id: "seed-estimate-1",
      estimateNo: "EST-0001",
      customerId: customer1.id,
      subtotal: dec("999"),
      discount: dec("0"),
      tax: dec("0"),
      total: dec("999"),
      note: "Seed estimate",
      validUntil: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      estimateDate: new Date(),
    },
  });

  await prisma.estimateItem.createMany({
    data: [
      {
        id: "seed-est-item-1",
        estimateId: est.id,
        productName: "Feature Phone",
        quantity: 1,
        unitPrice: dec("999"),
        total: dec("999"),
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------
  // 18) Damage
  // -----------------------
  console.log("18) Damage...");
  const dmg = await prisma.damage.upsert({
    where: { damageNo: "DMG-0001" },
    update: { total: dec("80"), note: "Damaged 1 USB cable" },
    create: {
      id: "seed-damage-1",
      damageNo: "DMG-0001",
      total: dec("80"),
      note: "Damaged 1 USB cable",
      damageDate: new Date(),
    },
  });

  await prisma.damageItem.createMany({
    data: [
      {
        id: "seed-dmg-item-1",
        damageId: dmg.id,
        productId: p3.id,
        quantity: 1,
        unitPrice: dec("80"),
        total: dec("80"),
      },
    ],
    skipDuplicates: true,
  });

  await prisma.stockLedger.upsert({
    where: { id: "seed-stock-dmg-1" },
    update: {
      productId: p3.id,
      type: StockLedgerType.OUT,
      source: StockLedgerSource.DAMAGE,
      referenceId: dmg.id,
      quantity: 1,
      note: "Damage",
      createdById: adminUser.id,
    },
    create: {
      id: "seed-stock-dmg-1",
      productId: p3.id,
      type: StockLedgerType.OUT,
      source: StockLedgerSource.DAMAGE,
      referenceId: dmg.id,
      quantity: 1,
      note: "Damage",
      createdById: adminUser.id,
    },
  });

  // -----------------------
  // 19) Settings
  // -----------------------
  console.log("19) Settings...");
  const settings = [
    { key: "shop_name", value: "SoftGhor Demo Shop" },
    { key: "shop_phone", value: "01700000000" },
    { key: "currency", value: "BDT" },
    { key: "invoice_prefix_sale", value: "SAL" },
    { key: "invoice_prefix_purchase", value: "PUR" },
  ];

  await prisma.$transaction(
    settings.map((s) =>
      prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value },
      }),
    ),
  );

  console.log("✅ FULL DEMO seed complete!");
  console.log("Admin:   admin@softghor.com / admin");
  console.log("Staff:   staff@softghor.com / staff");
  console.log("Cashier: cashier@softghor.com / cashier");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
