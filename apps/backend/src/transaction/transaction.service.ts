import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { StorageService, Transaction as Tx, TransactionType, Customer } from '../storage/storage.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private storage: StorageService) { }

  async findAll(
    customerId?: number,
    type?: TransactionType,
    from?: Date,
    to?: Date,
  ): Promise<Tx[]> {
    let txs = this.storage.getTransactions();

    if (customerId != null) {
      txs = txs.filter((t: Tx) => t.customerId === customerId);
    }
    if (type != null) {
      txs = txs.filter((t: Tx) => t.type === type);
    }
    if (from) {
      txs = txs.filter((t: Tx) => new Date(t.timestamp) >= from);
    }
    if (to) {
      txs = txs.filter((t: Tx) => new Date(t.timestamp) <= to);
    }

    // most recent first
    return txs.sort((a: Tx, b: Tx) => b.timestamp.localeCompare(a.timestamp));
  }

  async create(dto: CreateTransactionDto): Promise<Tx> {
    const { customerId, type, amount, note } = dto;
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    // load all three collections
    const customers = this.storage.getCustomers();
    const txs = this.storage.getTransactions();
    const wallet = this.storage.getCashWallet();

    const customer = customers.find((c: Customer) => c.id === customerId);
    if (!customer) {
      throw new NotFoundException(`Customer ${customerId} not found`);
    }

    // apply balances
    switch (type) {
      case TransactionType.ADD_CASH:
        customer.cashBalance += amount;
        wallet.cashOnHand += amount;
        break;
      case TransactionType.ADD_WALLET:
        customer.cashBalance += amount;
        wallet.digitalWallet += amount;
        break;
      case TransactionType.REMOVE_CASH:
        customer.cashBalance -= amount;
        wallet.cashOnHand -= amount;
        break;
      case TransactionType.REMOVE_WALLET:
        customer.cashBalance -= amount;
        wallet.digitalWallet -= amount;
        break;
      default:
        throw new BadRequestException('Unsupported transaction type');
    }

    // persist updated customer & wallet
    this.storage.saveCustomers(customers);
    this.storage.saveCashWallet({ ...wallet, lastUpdated: new Date().toISOString() });

    // create and persist the transaction record
    const nextId = txs.length > 0 ? Math.max(...txs.map((t: Tx) => t.id)) + 1 : 1;
    const newTx: Tx = {
      id: nextId,
      customerId,
      type,
      amount,
      timestamp: new Date().toISOString(),
      note,
    };
    txs.push(newTx);
    this.storage.saveTransactions(txs);

    return newTx;
  }

  // Delete a single transaction
  async delete(id: number): Promise<void> {
    const txs = this.storage.getTransactions();
    const txIndex = txs.findIndex(t => t.id === id);
    if (txIndex === -1) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    const tx = txs[txIndex];
    const customers = this.storage.getCustomers();
    const customer = customers.find(c => c.id === tx.customerId);
    if (!customer) {
      throw new NotFoundException(`Customer ${tx.customerId} not found`);
    }
    const wallet = this.storage.getCashWallet();

    // Reverse the transaction's effect
    switch (tx.type) {
      case TransactionType.ADD_CASH:
        customer.cashBalance -= tx.amount;
        wallet.cashOnHand -= tx.amount;
        break;
      case TransactionType.ADD_WALLET:
        customer.cashBalance -= tx.amount;
        wallet.digitalWallet -= tx.amount;
        break;
      case TransactionType.REMOVE_CASH:
        customer.cashBalance += tx.amount;
        wallet.cashOnHand += tx.amount;
        break;
      case TransactionType.REMOVE_WALLET:
        customer.cashBalance += tx.amount;
        wallet.digitalWallet += tx.amount;
        break;
    }

    // Remove the transaction
    txs.splice(txIndex, 1);

    // Save changes
    this.storage.saveCustomers(customers);
    this.storage.saveCashWallet(wallet);
    this.storage.saveTransactions(txs);
  }

  // Clear all transactions
  async clearAll(): Promise<void> {
    this.storage.saveTransactions([]); // Clear all transactions
    const customers = this.storage.getCustomers().map(c => ({
      ...c,
      cashBalance: 0, // Reset balances
      updatedAt: new Date().toISOString(),
    }));
    this.storage.saveCustomers(customers);
  }


  // async clearAll(): Promise<void> {
  //   const customers = this.storage.getCustomers();
  //   const wallet = this.storage.getCashWallet();

  //   // Reset all customer balances to zero
  //   customers.forEach(c => (c.cashBalance = 0));

  //   // Reset cash wallet balances
  //   wallet.cashOnHand = 0;
  //   wallet.digitalWallet = 0;

  //   // Clear all transactions
  //   this.storage.saveTransactions([]);
  //   this.storage.saveCustomers(customers);
  //   this.storage.saveCashWallet(wallet);
  // }
}
