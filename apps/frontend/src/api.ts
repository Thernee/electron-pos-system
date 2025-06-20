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
  ADD_CASH = 'ADD_CASH',
  ADD_WALLET = 'ADD_WALLET',
  REMOVE_CASH = 'REMOVE_CASH',
  REMOVE_WALLET = 'REMOVE_WALLET',
}

export type Transaction = {
  id: number;
  customerId: number;
  // customer: { name: string }
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

export type CreateCustomerPayload = {
  name: string;
  email?: string;
  phone?: string;
  cardNumber?: string;
};

export type CreateTransactionPayload = {
  customerId: number;
  type: TransactionType;
  amount: number;
  note?: string;
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
export async function createCustomer(
  data: CreateCustomerPayload
): Promise<Customer> {
  const res = await fetch(`${API_BASE}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Create failed: ${res.statusText}`);
  }
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
export async function fetchTransactions(
  customerId?: number,
  type?: TransactionType,
  from?: string,
  to?: string
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (customerId) params.append('customerId', String(customerId));
  if (type) params.append('type', type);
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  const res = await fetch(`${API_BASE}/transactions?${params.toString()}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
export async function createTransaction(
  data: CreateTransactionPayload
): Promise<Transaction> {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Create failed: ${res.statusText}`);
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

// Reports APIs
export type CustomerBalance = { id: number; name: string; balance: number };
export type AdminSummary = { totalCustomer: number; adminCashOnHand: number; adminDigital: number };

export async function fetchCustomerBalances(): Promise<CustomerBalance[]> {
  const res = await fetch(`${API_BASE}/reports/customer-balances`);
  return res.json();
}

export async function fetchAdminSummary(): Promise<AdminSummary> {
  const res = await fetch(`${API_BASE}/reports/admin-summary`);
  return res.json();
}

export async function fetchTransactionsReport(from?: string, to?: string): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);
  const url = `${API_BASE}/reports/transactions${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  return res.json();
}

export async function deleteCustomer(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/customers/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    try {
      const errorData = await res.json();
      throw new Error(errorData.message || `Delete failed: ${res.statusText}`);
    } catch (e) {
      throw new Error(`Delete failed: ${res.statusText}`);
    }
  }
}

export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Delete failed: ${res.statusText}`);
  }
}

export async function clearAllTransactions(): Promise<void> {
  const res = await fetch(`${API_BASE}/transactions`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error(`Delete failed: ${res.statusText}`);
  }
}
