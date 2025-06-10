import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CustomerList from './pages/CustomerList';
import CustomerAdd from './pages/CustomerAdd';
import CustomerEdit from './pages/CustomerEdit';
import TransactionList from './pages/TransactionList';
import TransactionAdd from './pages/TransactionAdd';
import CashWalletView from './components/CashWalletView';

export default function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">POS Management System</h1>
        <nav className="space-x-4 mb-6">
          <NavLink to="/customers" className={({ isActive }) => isActive ? 'font-bold' : ''}>Customers</NavLink>
          <NavLink to="/transactions" className={({ isActive }) => isActive ? 'font-bold' : ''}>Transactions</NavLink>
          <NavLink to="/wallet" className={({ isActive }) => isActive ? 'font-bold' : ''}>Admin Wallet</NavLink>
        </nav>
        <Routes>
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<CustomerAdd />} />
          <Route path="/customers/:id/edit" element={<CustomerEdit />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/add" element={<TransactionAdd />} />
          <Route path="/wallet" element={<CashWalletView />} />
          <Route path="/*" element={<CustomerList />} />
        </Routes>
      </div>
    </Router>
  );
}