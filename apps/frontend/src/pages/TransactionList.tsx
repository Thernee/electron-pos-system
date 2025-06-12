import React, { useEffect, useState } from 'react';
import { fetchTransactions, Transaction, TransactionType, fetchCustomers, Customer } from '../api';
import { Link } from 'react-router-dom';

export default function TransactionList() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filters, setFilters] = useState({
    customerId: '',
    type: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    fetchCustomers().then(setCustomers);
    load();
  }, []);

  async function load() {
    const data = await fetchTransactions(
      filters.customerId ? Number(filters.customerId) : undefined,
      filters.type ? (filters.type as TransactionType) : undefined,
      filters.from,
      filters.to
    );
    setTxs(data);
  }


  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={filters.customerId}
          onChange={e => setFilters(f => ({ ...f, customerId: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="">All Customers</option>
          {customers.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>

        <select
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          {Object.values(TransactionType).map(t => (
            <option key={t} value={t}>{t.replace('_', ' ')}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.from}
          onChange={e => setFilters(f => ({ ...f, from: e.target.value }))}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={filters.to}
          onChange={e => setFilters(f => ({ ...f, to: e.target.value }))}
          className="border p-2 rounded"
        />

        <button
          onClick={load}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transactions</h2>
        <Link to="/transactions/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + New Transaction
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Customer</th>
            </tr>
          </thead>
          <tbody>
            {txs.map(t => {
              const isAdd = t.type.startsWith('ADD_');
              return (
                <tr
                  key={t.id}
                  className={`border-t ${isAdd ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <td className="px-6 py-4">{new Date(t.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4">{t.type.replace('_', ' ')}</td>
                  <td className="px-6 py-4">₦{t.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{t.customer.name}</td>
                  <td className="px-6 py-4">{t.note || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
