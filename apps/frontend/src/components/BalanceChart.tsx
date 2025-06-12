import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CustomerBalance } from '../api';

type Props = { data: CustomerBalance[] };

export default function BalanceChart({ data }: Props) {
  // transform to [{ name, balance }, ...]
  const chartData = data.map(c => ({
    name: c.name,
    balance: c.balance,
  }));

  return (
    <div className="card">
      <h3 className="font-semibold mb-2">Customer Balances Chart</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip formatter={(value: number) => `₦${value.toFixed(2)}`} />
          <Bar dataKey="balance" fill="#3182ce" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
