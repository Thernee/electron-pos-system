import React, { useEffect, useState } from 'react';
import { fetchTransactions, Transaction } from '../api';
import { Link } from 'react-router-dom';

export default function TransactionList() {
  const [txs, setTxs] = useState<Transaction[]>([]);

  useEffect(() => { fetchTransactions().then(setTxs); }, []);

  return (
    <div>
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
            {txs.map(t => (
              <tr key={t.id} className="border-t">
                <td className="px-6 py-4">{new Date(t.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">{t.type.replace('_', ' ')}</td>
                <td className="px-6 py-4">₦{t.amount.toFixed(2)}</td>
                <td className="px-6 py-4">{t.customer.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}