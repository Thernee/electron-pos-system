import React, { useEffect, useState } from 'react';
import { fetchCustomers, Customer } from '../api';
import { Link } from 'react-router-dom';

export default function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetchCustomers().then(setCustomers); }, []);
  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="search"
          placeholder="🔍 Search customers"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border rounded-md px-4 py-2 w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Link
          to="/customers/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
        >
          + Add Customer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(c => {
          const pos = c.cashBalance >= 0;
          return (
            <div key={c.id} className="card">
              <h3 className="text-lg font-semibold mb-2">{c.name}</h3>
              <p>
                Cash:{' '}
                <span className={pos ? 'text-gray-800' : 'text-red-600'}>
                  ₦{c.cashBalance.toFixed(2)}
                </span>
              </p>
              <p>Wallet: ₦{c.cashBalance.toFixed(2)}</p>
              <p>Debt: ₦{c.debtBalance.toFixed(2)}</p>
              <Link
                to={`/customers/${c.id}/edit`}
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
