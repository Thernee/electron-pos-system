import React, { useEffect, useState } from 'react';
import {
  fetchTransactions,
  fetchCustomers,
  createTransaction,
  Transaction,
  Customer,
  TransactionType,
} from '../api';

export default function TransactionView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<{
    customerId: number | '';
    type: TransactionType;
    amount: number | '';
  }>({ customerId: '', type: TransactionType.ATM_DEDUCTION, amount: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    setCustomers(await fetchCustomers());
    setTransactions(await fetchTransactions());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerId || !form.amount) return;
    await createTransaction({
      customerId: form.customerId,
      type: form.type,
      amount: form.amount,
    });
    setForm({ customerId: '', type: TransactionType.ATM_DEDUCTION, amount: '' });
    load();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Transactions</h2>
      <ul className="mb-4">
        {transactions.map((t) => (
          <li key={t.id}>
            {t.type} ₦{t.amount.toFixed(2)} for Customer #{t.customerId}
          </li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="space-y-2">
        <select
          required
          value={form.customerId}
          onChange={(e) => setForm({ ...form, customerId: Number(e.target.value) })}
          className="border p-1 w-full"
        >
          <option value="">Select customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
          className="border p-1 w-full"
        >
          <option value={TransactionType.ATM_DEDUCTION}>ATM Deduction</option>
          <option value={TransactionType.CASH_COLLECTION}>Cash Collection</option>
        </select>
        <input
          required
          placeholder="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          className="border p-1 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Submit Transaction
        </button>
      </form>
    </div>
  );
}
