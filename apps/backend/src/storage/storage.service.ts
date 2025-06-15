import { Injectable } from '@nestjs/common';
import Conf from 'conf';

export interface Customer {
  id: number;
  name: string;
  cardNumber?: string;
  email?: string;
  phone?: string;
  cashBalance: number;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  ADD_CASH = 'ADD_CASH',
  ADD_WALLET = 'ADD_WALLET',
  REMOVE_CASH = 'REMOVE_CASH',
  REMOVE_WALLET = 'REMOVE_WALLET',
}

export interface Transaction {
  id: number;
  customerId: number;
  type: TransactionType;
  amount: number;
  timestamp: string;
  note?: string;
}

export interface CashWallet {
  id: number;
  cashOnHand: number;
  digitalWallet: number;
  lastUpdated: string;
}

interface Schema {
  customers: Customer[];
  transactions: Transaction[];
  cashWallet: CashWallet;
}

@Injectable()
export class StorageService {
  private store!: Conf<Schema>;

  constructor() {
    (async () => {
      const { default: Conf } = await import('conf');
      const cwd = process.env.APP_USER_DATA ?? process.cwd();
      this.store = new Conf<Schema>({
        cwd,
        projectName: 'pos-data',
        defaults: {
          customers: [],
          transactions: [],
          cashWallet: {
            id: 1,
            cashOnHand: 0,
            digitalWallet: 0,
            lastUpdated: new Date().toISOString(),
          },
        },
      });
    })();
  }

  getCustomers(): Customer[] {
    return this.store.get('customers');
  }
  saveCustomers(all: Customer[]): void {
    this.store.set('customers', all);
  }

  getTransactions(): Transaction[] {
    return this.store.get('transactions');
  }
  saveTransactions(all: Transaction[]): void {
    this.store.set('transactions', all);
  }

  getCashWallet(): CashWallet {
    return this.store.get('cashWallet');
  }
  saveCashWallet(w: CashWallet): void {
    this.store.set('cashWallet', w);
  }
}
