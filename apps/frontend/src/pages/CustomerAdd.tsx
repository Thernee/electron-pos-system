import React, { useState } from 'react';
import { createCustomer } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CustomerAdd() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCustomer(form);
    nav('/customers');
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Add Customer</h2>
      <input
        required
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        className="border p-2 w-full"
      />
      <input
        placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}