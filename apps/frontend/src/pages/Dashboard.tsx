import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { fetchCustomerBalances, fetchAdminSummary, CustomerBalance, AdminSummary } from '../api';

export default function Dashboard() {
  const [cust, setCust] = useState<CustomerBalance[]>([]);
  const [admin, setAdmin] = useState<AdminSummary | null>(null);

  useEffect(() => {
    fetchAdminSummary().then(setAdmin);
    fetchCustomerBalances().then(setCust);
  }, []);

  function saveAsPDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('POS Dashboard Report', 14, 20);

    doc.setFontSize(12);
    if (admin) {
      doc.text(`Total Customer Balances: ₦${admin.totalCustomer.toFixed(2)}`, 14, 30);
      doc.text(`Admin Cash: ₦${admin.adminCashOnHand.toFixed(2)}`, 14, 36);
      doc.text(`Admin Digital: ₦${admin.adminDigital.toFixed(2)}`, 14, 42);
    }

    let y = 54;
    doc.text('Customer Balances:', 14, y);
    y += 6;
    cust.forEach(c => {
      doc.text(`${c.name}: ₦${c.balance.toFixed(2)}`, 14, y);
      y += 6;
      if (y > 280) { doc.addPage(); y = 20; }
    });

    doc.save(`dashboard-${Date.now()}.pdf`);
  }

  return (
    <div className="space-y-8">
      <button
        onClick={saveAsPDF}
        className="bg-purple-600 text-white px-4 py-2 rounded-md shadow hover:bg-purple-700"
      >
        📄 Export as PDF
      </button>
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
          {cust.map(c => {
            const isNeg = c.balance < 0;
            return (
              <div key={c.id} className="card">
                <h4 className="font-semibold">{c.name}</h4>
                <p>
                  Balance:{' '}
                  <span className={isNeg ? 'text-red-600' : 'text-gray-800'}>
                    ₦{c.balance.toFixed(2)}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}