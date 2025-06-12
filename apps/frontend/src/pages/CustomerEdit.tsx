import React, { useEffect, useState } from 'react';
import { fetchCustomerById, updateCustomer, deleteCustomer, Customer } from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function CustomerEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState<Partial<Customer>>({});

  useEffect(() => {
    if (id) fetchCustomerById(+id).then(c => setForm(c));
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (id) await updateCustomer(+id, form);
    nav('/customers');
  }

  async function onDelete() {
    if (!id) return;
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(+id);
      nav('/customers');
    }
  }

  return (
    <div className="card max-w-md mx-auto space-y-4">
      <Link to="/customers" className="text-blue-600 hover:underline mb-4 block">⇚  Back to Customers</Link>
      <h2 className="text-xl font-semibold">Edit Customer</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          required
          placeholder="Name"
          value={form.name || ''}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email || ''}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <input
          placeholder="Phone"
          value={form.phone || ''}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
