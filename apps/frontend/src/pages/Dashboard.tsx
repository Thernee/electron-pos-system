import React, { useEffect, useState } from 'react';
import { fetchCustomerBalances, fetchAdminSummary, CustomerBalance, AdminSummary } from '../api';

export default function Dashboard() {
  const [cust, setCust] = useState<CustomerBalance[]>([]);
  const [admin, setAdmin] = useState<AdminSummary | null>(null);

  useEffect(() => {
    fetchAdminSummary().then(setAdmin);
    fetchCustomerBalances().then(setCust);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="font-semibold mb-2">Total Customer Balances</h3>
          <p className="text-2xl">₦{admin?.totalCustomer.toFixed(2)}</p>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold mb-2">Admin Cash</h3>
          <p className="text-2xl">₦{admin?.adminCashOnHand.toFixed(2)}</p>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold mb-2">Admin Digital</h3>
          <p className="text-2xl">₦{admin?.adminDigital.toFixed(2)}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Customer Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cust.map(c => (
            <div key={c.id} className="card">
              <h4 className="font-semibold">{c.name}</h4>
              <p>Balance: ₦{c.balance.toFixed(2)}</p>
              <p>Debt: ₦{c.debt.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}