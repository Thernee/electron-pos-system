import React, { useEffect, useState } from 'react';
import { fetchCustomers, createTransaction, TransactionType, Customer } from '../api';
import { useNavigate } from 'react-router-dom';

export default function TransactionAdd() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<{ customerId: string; type: TransactionType; amount: string; note: string }>({
    customerId: '',
    type: TransactionType.ADD_CASH,
    amount: '',
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  useEffect(() => {
    fetchCustomers()
      .then(setCustomers)
      .catch(err => setError('Failed to load customers'));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customerId || isNaN(Number(form.amount))) {
      setError('Please select a customer and enter a valid amount');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createTransaction({
        customerId: Number(form.customerId),
        type: form.type,
        amount: Number(form.amount),
        note: form.note.trim() || undefined,
      });
      nav('/transactions');
    } catch (err) {
      setError('Failed to create transaction');
    } finally {
      setIsSubmitting(false);
    }
  }

  const green = form.type.startsWith('ADD_');

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">New Transaction</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={onSubmit}>
        <select
          required
          value={form.customerId}
          onChange={e => setForm({ ...form, customerId: e.target.value })}
          className="border p-2 w-full rounded-md mb-4"
        >
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value as TransactionType })}
          className={`border p-2 w-full rounded-md mb-4 ${green ? 'bg-green-50' : 'bg-red-50'}`}
        >
          <option value={TransactionType.ADD_CASH}>Add to Cash</option>
          <option value={TransactionType.ADD_WALLET}>Add to Wallet</option>
          <option value={TransactionType.REMOVE_CASH}>Remove from Cash</option>
          <option value={TransactionType.REMOVE_WALLET}>Remove from Wallet</option>
        </select>
        <input
          required
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          className="border p-2 w-full rounded-md mb-4"
        />
        <textarea
          placeholder="Note (optional)"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
          className="border p-2 w-full rounded-md mb-4"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white px-4 py-2 rounded-md shadow ${green ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} ${isSubmitting ? 'opacity-50' : ''}`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}