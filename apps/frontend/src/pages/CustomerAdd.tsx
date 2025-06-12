import React, { useState } from 'react';
import { createCustomer, CreateCustomerPayload } from '../api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function CustomerAdd() {
  const nav = useNavigate();
  const [form, setForm] = useState<CreateCustomerPayload>({
    name: '',
    email: '',
    phone: '',
    cardNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Build payload with only non-empty optional fields
      const payload: CreateCustomerPayload = { name: form.name.trim() };
      if (form.email?.trim()) {
        payload.email = form.email.trim();
      }
      if (form.phone?.trim()) {
        payload.phone = form.phone.trim();
      }
      if (form.cardNumber?.trim()) {
        payload.cardNumber = form.cardNumber.trim();
      }
      await createCustomer(payload);
      nav('/customers');
    } catch (err) {
      console.error(err);
      setError('Failed to create customer');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <Link to="/customers" className="text-blue-600 hover:underline mb-4 block">⇚  Back to Customers</Link>
      <h2 className="text-xl font-semibold mb-4">Add Customer</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <input
          placeholder="Card Number"
          value={form.cardNumber}
          onChange={e => setForm({ ...form, cardNumber: e.target.value })}
          className="border p-2 w-full rounded-md"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white px-4 py-2 rounded-md shadow
            ${isSubmitting ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Saving…' : 'Save Customer'}
        </button>
      </form>
    </div>
  );
}
