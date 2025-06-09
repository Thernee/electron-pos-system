import React, { useState } from 'react';
import CustomerView from './components/CustomerView';
import TransactionView from './components/TransactionView';
import CashWalletView from './components/CashWalletView';

export default function App() {
  const [tab, setTab] = useState<'customers' | 'transactions' | 'cashwallet'>('customers');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">POS Management System</h1>
      <nav className="mb-4">
        {['customers', 'transactions', 'cashwallet'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`mr-2 px-3 py-1 rounded ${tab === t ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>
      <div>
        {tab === 'customers' && <CustomerView />}
        {tab === 'transactions' && <TransactionView />}
        {tab === 'cashwallet' && <CashWalletView />}
      </div>
    </div>
  );
}