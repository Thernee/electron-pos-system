# POS Management System

A desktop Point-Of-Sale record-keeping app built with NestJS (backend), React/Vite (frontend), and Electron.

## Features

- **Customer Management**  
  - Add / Edit / Delete customers  
  - Track individual cash balances (can go negative)
- **Transaction Management**  
  - Four types: Add to Cash, Add to Wallet, Remove from Cash, Remove from Wallet  
  - Optional notes per transaction  
  - Color-coded in the UI (green for additions, red for removals)  
  - Filters by customer, type, and date range
- **Admin Wallet**  
  - Tracks physical cash on hand and digital wallet balance
- **Dashboard & Reporting**  
  - Summary cards (total customer balances, admin cash/digital amounts, transaction count, total volume)  
  - Bar chart of customer balances (via Recharts)  
  - PDF export of dashboard  
- **Packaging**  
  - Single executable via Electron Builder  

## Tech Stack

- **Backend**: NestJS, Prisma, SQLite  
- **Frontend**: React, Vite, Tailwind CSS, Recharts, jsPDF  
- **Desktop Shell**: Electron, Electron Builder  

## Getting Started

### Prerequisites

- Node.js ≥ 18  
- PNPM (recommended)  

### Installation

```bash
# Clone
git clone <repo-url>
cd electron-pos-system

# Install all workspaces
pnpm install

Development
Run backend, frontend, and Electron simultaneously with HMR:

```bash
pnpm dev
This will:

Start NestJS on http://localhost:3000

Start Vite on http://localhost:5173

Launch Electron pointing to the Vite URL

Building for Production
```bash
# Build and bundle everything
pnpm dist

- Backend: compiles to apps/backend/dist/

- Frontend: static site in apps/frontend/dist/

- Electron: packaged in apps/electron/dist/ (or release/)

Running the Packaged App

```bash
cd apps/electron/dist/linux-unpacked
./electron-pos-system   # or the actual executable name

On macOS or Windows, run the .dmg/.exe installer or unpacked folder.

Usage
Add a Customer: Home → Customers → “+ Add Customer”

Record a Transaction: Transactions → “+ New Transaction”

View Dashboard: Home or Dashboard in the nav

Export PDF: Click “Export as PDF” on the Dashboard

Configuration
Environment Variables (frontend):

VITE_API_BASE: backend URL (default http://localhost:3000)

Database: apps/backend/prisma/dev.db (SQLite)

Project Structure

electron-pos-system/
├─ apps/
│  ├─ backend/    # NestJS + Prisma
│  ├─ frontend/   # React + Vite + Tailwind
│  └─ electron/   # Electron shell & builder config
├─ prisma/        # shared schema (if any)
├─ package.json   # root, orchestrates workspaces & scripts
└─ pnpm-workspace.yaml

Troubleshooting
“CashWallet not found”: Delete dev.db and re-run pnpm prisma migrate dev --name reset && ts-node prisma/seed.ts.

Blank pages: Check browser console for JSX syntax errors (unclosed tags).

Tailwind not working: Ensure you ran pnpm --filter frontend add -D tailwindcss postcss autoprefixer then pnpm --filter frontend exec tailwindcss init -p.