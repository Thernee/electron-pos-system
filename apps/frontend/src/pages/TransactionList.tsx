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
        <Link to="/transactions/add" className="bg-blue-500 text-white px-4 py-2 rounded">New Transaction</Link>
      </div>
      <table className="w-full table-auto">
        <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Customer</th></tr></thead>
        <tbody>
          {txs.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.timestamp).toLocaleString()}</td>
              <td>{t.type.replace('_', ' ')}</td>
              <td>₦{t.amount.toFixed(2)}</td>
              <td>{t.customerId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
