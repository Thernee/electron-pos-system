export const API_BASE = import.meta.env.VITE_API_BASE;

export type Customer = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cashBalance: number;
  walletBalance: number;
  debtBalance: number;
};

export enum TransactionType {
  ATM_DEDUCTION = 'ATM_DEDUCTION',
  CASH_COLLECTION = 'CASH_COLLECTION',
  CASH_DEPOSIT = 'CASH_DEPOSIT',
  ATM_DEPOSIT = 'ATM_DEPOSIT',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  CASH_WITHDRAWAL = 'CASH_WITHDRAWAL'
}

export type Transaction = {
  id: number;
  customerId: number;
  type: TransactionType;
  amount: number;
  timestamp: string;
  note?: string;
};

export type CashWallet = {
  cashOnHand: number;
  digitalWallet: number;
  lastUpdated: string;
};

// Customer APIs
export async function fetchCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/customers`);
  return res.json();
}
export async function fetchCustomerById(id: number): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers/${id}`);
  return res.json();
}
export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateCustomer(id: number, data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// Transaction APIs
export async function fetchTransactions(customerId?: number): Promise<Transaction[]> {
  const url = customerId
    ? `${API_BASE}/transactions?customerId=${customerId}`
    : `${API_BASE}/transactions`;
  const res = await fetch(url);
  return res.json();
}
export async function createTransaction(data: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// CashWallet APIs
export async function fetchCashWallet(): Promise<CashWallet> {
  const res = await fetch(`${API_BASE}/cash-wallet`);
  return res.json();
}
export async function adjustCash(data: Partial<CashWallet>): Promise<CashWallet> {
  const res = await fetch(`${API_BASE}/cash-wallet`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
