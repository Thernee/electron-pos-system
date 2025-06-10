import React, { useEffect, useState } from 'react';
import { fetchCustomers, Customer } from '../api';
import { Link } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchCustomers().then(setCustomers); }, []);
  const filtered = customers.filter(c => c.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search customers"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border p-2"
        />
        <Link to="/customers/add" className="bg-green-500 text-white px-4 py-2 rounded">Add Customer</Link>
      </div>
      <table className="w-full table-auto">
        <thead><tr><th>Name</th><th>Balance</th><th>Debt</th><th>Actions</th></tr></thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>₦{(c.cashBalance + c.walletBalance - c.debtBalance).toFixed(2)}</td>
              <td>₦{c.debtBalance.toFixed(2)}</td>
              <td><Link to={`/customers/${c.id}/edit`} className="text-blue-600">Edit</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}