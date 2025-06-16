
# POS Management System

A desktop Point-Of-Sale record-keeping app built with NestJS, React/Vite, and Electron.


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

- **Backend**: NestJS, `conf` for storage  
- **Frontend**: React, Vite, Tailwind CSS, Recharts, jsPDF  
- **Desktop Shell**: Electron, Electron Builder  

## Prerequisites

- Node.js ≥ 18  
- PNPM (recommended)  
## Installation

Install dependencies for all workspaces:

```bash
  pnpm install
```
    
## Development
Run the app in development mode with hot module replacement (HMR):
```
pnpm dev
```
This will:
- Start the NestJS backend on http://localhost:3000
- Start the Vite frontend on http://localhost:3001
- Launch Electron after both services are ready


## Building for Production

Build and package the app into a desktop executable:
```
pnpm dist
```
This will:
- Bundle the backend with ncc into backend/dist-bundle
- Build the frontend with Vite into frontend/dist
- Compile the Electron app with TypeScript
- Package everything into an executable with Electron Builder

Output is in electron/release/ (exact folder depends on your OS).


## Running the Packaged App

- **Linux**: Run the .AppImage or executable in apps/electron/release/linux-unpacked/
- **Windows**: Run the .exe installer or app in apps/electron/release/win-unpacked/

## Usage

- **Add a Customer**: Home → Customers → “+ Add Customer”
- **Record a Transaction**: Transactions → “+ New Transaction”
- **View Dashboard**: Home or Dashboard in the nav
- **Export PDF**: Click “Export as PDF” on the Dashboard


## Project Structure

```
pos-system/
├─ backend/       # NestJS + `conf` storage
├─ frontend/      # React + Vite + Tailwind
├─ electron/      # Electron shell & builder config
├─ package.json   # Root, orchestrates workspaces & scripts
└─ pnpm-workspace.yaml
```
## Troubleshooting

- **Data not persisting**: Ensure conf is correctly configured with the APP_USER_DATA environment variable.
- **Blank pages**: Check the browser console for JSX syntax errors (e.g., unclosed tags).
- **Tailwind not working**: Ensure Tailwind is installed and configured:
```
pnpm --filter frontend add -D tailwindcss postcss autoprefixer
pnpm --filter frontend exec tailwindcss init -p
```

## Maintainers

[@Sani Abubakar Adam](https://github.com/thernee)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2025 Sani Abubakar Adam
