import React, { useEffect, useState } from 'react';
import { fetchCustomers, createTransaction, TransactionType, Customer } from '../api';
import { useNavigate } from 'react-router-dom';

export default function TransactionAdd() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState({ customerId: '', type: TransactionType.CASH_DEPOSIT, amount: '' });
  const nav = useNavigate();

  useEffect(() => { fetchCustomers().then(setCustomers); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createTransaction({ customerId: +form.customerId, type: form.type, amount: +form.amount });
    nav('/transactions');
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">New Transaction</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <select required value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} className="border p-2 w-full rounded-md">
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as TransactionType })} className="border p-2 w-full rounded-md">
          {Object.values(TransactionType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
        </select>
        <input required type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="border p-2 w-full rounded-md" />
        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}