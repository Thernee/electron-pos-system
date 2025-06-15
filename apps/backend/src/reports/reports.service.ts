import { Injectable } from '@nestjs/common';
import { StorageService, Transaction, CashWallet } from '../storage/storage.service';

@Injectable()
export class ReportsService {
  constructor(private storage: StorageService) { }

  /** Customer balances: id, name, cashBalance */
  async customerBalances(): Promise<{ id: number; name: string; balance: number }[]> {
    const customers = this.storage.getCustomers();
    return customers.map(c => ({
      id: c.id,
      name: c.name,
      balance: c.cashBalance,
    }));
  }

  /** Admin summary: total of customer cash + cashOnHand + digitalWallet */
  async adminSummary(): Promise<{
    totalCustomer: number;
    adminCashOnHand: number;
    adminDigital: number;
  }> {
    const customers = this.storage.getCustomers();
    const wallet = this.storage.getCashWallet();

    const totalCustomer = customers.reduce((sum, c) => sum + c.cashBalance, 0);

    return {
      totalCustomer,
      adminCashOnHand: wallet.cashOnHand,
      adminDigital: wallet.digitalWallet,
    };
  }

  /** Transactions report filtered by optional ISO date strings */
  async transactionsReport(from?: string, to?: string): Promise<
    (Transaction & { customerName: string })[]
  > {
    let txs = this.storage.getTransactions();
    const customersById = Object.fromEntries(
      this.storage.getCustomers().map(c => [c.id, c.name]),
    );

    if (from) {
      const d1 = new Date(from);
      txs = txs.filter(t => new Date(t.timestamp) >= d1);
    }
    if (to) {
      const d2 = new Date(to);
      txs = txs.filter(t => new Date(t.timestamp) <= d2);
    }

    return txs
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .map(t => ({
        ...t,
        customerName: customersById[t.customerId] || 'Unknown',
      }));
  }
}
