// types/customer.ts

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  openingBalance?: number;
  due?: number;
  createdById?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateCustomerDto {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  openingBalance?: number;
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface CustomerPaymentDto {
  amount: number;
  paymentMethod: "CASH" | "CARD" | "BKASH" | "BANK";
  note?: string;
  paymentDate?: Date;
}

export interface CustomerLedger {
  id: string;
  customerId: string;
  type: "OPENING_BALANCE" | "SALE_DUE" | "PAYMENT";
  amount: number;
  balance: number;
  referenceId?: string;
  note?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}
