import React, { useEffect, useState } from 'react';
import { fetchCashWallet, adjustCash, CashWallet } from '../api';

export default function CashWalletView() {
  const [wallet, setWallet] = useState<CashWallet>({ cashOnHand: 0, digitalWallet: 0 });
  const [form, setForm] = useState<{ cashOnHand: number | ''; digitalWallet: number | '' }>({ cashOnHand: '', digitalWallet: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    const data = await fetchCashWallet();
    setWallet(data);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Partial<CashWallet> = {};
    if (form.cashOnHand !== '') payload.cashOnHand = form.cashOnHand;
    if (form.digitalWallet !== '') payload.digitalWallet = form.digitalWallet;
    await adjustCash(payload);
    setForm({ cashOnHand: '', digitalWallet: '' });
    load();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Cash & Wallet</h2>
      <p>Cash on Hand: ₦{wallet.cashOnHand.toFixed(2)}</p>
      <p>Digital Wallet: ₦{wallet.digitalWallet.toFixed(2)}</p>

      <form onSubmit={onSubmit} className="space-y-2 mt-4">
        <input
          placeholder="New Cash on Hand"
          type="number"
          value={form.cashOnHand}
          onChange={(e) => setForm({ ...form, cashOnHand: Number(e.target.value) })}
          className="border p-1 w-full"
        />
        <input
          placeholder="New Digital Wallet"
          type="number"
          value={form.digitalWallet}
          onChange={(e) => setForm({ ...form, digitalWallet: Number(e.target.value) })}
          className="border p-1 w-full"
        />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-1 rounded">
          Adjust
        </button>
      </form>
    </div>
  );
}
