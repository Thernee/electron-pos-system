import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">POS Management</h1>
          <nav className="space-x-4">
            {['customers', 'transactions', 'wallet', 'dashboard'].map((path) => (
              <NavLink
                key={path}
                to={`/${path}`}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }
              >
                {path.charAt(0).toUpperCase() + path.slice(1)}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="bg-white shadow-inner py-4">
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} POS System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}