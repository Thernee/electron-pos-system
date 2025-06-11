import React, { useState } from 'react';
import { createCustomer, CreateCustomerPayload } from '../api';
import { useNavigate } from 'react-router-dom';

export default function CustomerAdd() {
  const nav = useNavigate();
  const [form, setForm] = useState<CreateCustomerPayload>({ name: '', email: '', phone: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createCustomer(form);
    nav('/customers');
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Customer</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 w-full rounded-md" />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border p-2 w-full rounded-md" />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="border p-2 w-full rounded-md" />
        <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600">
          Save
        </button>
      </form>
    </div>
  );
}