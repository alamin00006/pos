// src/types/supplier.ts

export type Supplier = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  openingBalance?: number | string;
  due?: number; // backend adds due
  createdAt?: string;
  updatedAt?: string;
};

export type SupplierLedger = {
  id: string;
  supplierId: string;
  type: string; // SupplierLedgerType enum as string
  referenceId?: string | null;
  amount: number | string;
  balance: number | string;
  note?: string | null;
  createdAt?: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SupplierListResponse = {
  data: Supplier[];
  meta: PaginationMeta;
};

export type SupplierResponse = {
  data: Supplier;
};

export type SupplierLedgerListResponse = {
  data: SupplierLedger[];
  meta: PaginationMeta;
};

export type CreateSupplierDto = {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  openingBalance?: number | string;
};

export type UpdateSupplierDto = Partial<CreateSupplierDto>;

export type SupplierPaymentDto = {
  amount: number | string;
  paymentMethod: "CASH" | "BANK" | "MOBILE_BANKING" | string;
  note?: string;
  paymentDate?: string | Date;
};
