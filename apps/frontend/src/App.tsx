import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CustomerList from './pages/CustomerList';
import CustomerAdd from './pages/CustomerAdd';
import CustomerEdit from './pages/CustomerEdit';
import TransactionList from './pages/TransactionList';
import TransactionAdd from './pages/TransactionAdd';
import CashWalletView from './components/CashWalletView';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/add" element={<CustomerAdd />} />
          <Route path="customers/:id/edit" element={<CustomerEdit />} />

          <Route path="transactions" element={<TransactionList />} />
          <Route path="transactions/add" element={<TransactionAdd />} />

          <Route path="wallet" element={<CashWalletView />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}