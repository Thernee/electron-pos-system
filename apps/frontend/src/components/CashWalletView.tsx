import React, { useEffect, useState } from 'react';
import { fetchCashWallet, adjustCash, CashWallet } from '../api';

export default function CashWalletView() {
  const [wallet, setWallet] = useState<CashWallet>({ cashOnHand: 0, digitalWallet: 0, lastUpdated: '' });
  const [form, setForm] = useState<{ cashOnHand: number | ''; digitalWallet: number | '' }>({ cashOnHand: '', digitalWallet: '' });

  useEffect(() => { fetchCashWallet().then(setWallet); }, []);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data: Partial<CashWallet> = {};
    if (form.cashOnHand !== '') data.cashOnHand = form.cashOnHand;
    if (form.digitalWallet !== '') data.digitalWallet = form.digitalWallet;
    await adjustCash(data);
    setForm({ cashOnHand: '', digitalWallet: '' });
    fetchCashWallet().then(setWallet);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Admin Wallet</h2>
      <p>Cash on Hand: ₦{wallet.cashOnHand.toFixed(2)}</p>
      <p>Digital Wallet: ₦{wallet.digitalWallet.toFixed(2)}</p>
      <form onSubmit={onSubmit} className="space-y-2 mt-4">
        <input type="number" placeholder="New Cash on Hand" value={form.cashOnHand} onChange={e => setForm({ ...form, cashOnHand: Number(e.target.value) })} className="border p-1 w-full" />
        <input type="number" placeholder="New Digital Wallet" value={form.digitalWallet} onChange={e => setForm({ ...form, digitalWallet: Number(e.target.value) })} className="border p-1 w-full" />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-1 rounded">Adjust</button>
      </form>
    </div>
  );
}
