import React, { useEffect, useState } from 'react';
import { fetchCustomers, createCustomer, Customer } from '../api';

export default function CustomerView() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [form, setForm] = useState<Partial<Customer>>({ name: '', email: '', phone: '' });

  useEffect(() => { load(); }, []);
  async function load() { setCustomers(await fetchCustomers()); }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCustomer(form);
    setForm({ name: '', email: '', phone: '' });
    load();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Customers</h2>
      <ul className="mb-4">
        {customers.map((c) => (
          <li key={c.id}>{c.name} - Balance: ₦{c.balance.toFixed(2)}</li>
        ))}
      </ul>
      <form onSubmit={onSubmit} className="space-y-2">
        <input
          required
          placeholder="Name"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-1 w-full"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email || ''}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-1 w-full"
        />
        <input
          placeholder="Phone"
          value={form.phone || ''}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-1 w-full"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
          Add Customer
        </button>
      </form>
    </div>
  );
}
