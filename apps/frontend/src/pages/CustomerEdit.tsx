import React, { useEffect, useState } from 'react';
import { fetchCustomerById, updateCustomer, Customer } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Customer</h2>
      <input required placeholder="Name" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
    </form>
  );
}
