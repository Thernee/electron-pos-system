import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) { }

  // Customer balance
  async customerBalances() {
    const customers = await this.prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        cashBalance: true,
      },
    });
    return customers.map(c => ({
      id: c.id,
      name: c.name,
      balance: c.cashBalance,
    }));
  }

  // Admin summary: sum of all customer balances + admin wallet cash & digital
  async adminSummary() {
    // ensure the singleton row exists
    const wallet = await this.prisma.cashWallet.upsert({
      where: { id: 1 },
      update: {}, // nothing to update
      create: { cashOnHand: 0, digitalWallet: 0 },
    });

    const sum = await this.prisma.customer.aggregate({
      _sum: { cashBalance: true },
    });
    const totalCustomer = sum._sum.cashBalance ?? 0;

    return {
      totalCustomer,
      adminCashOnHand: wallet.cashOnHand,
      adminDigital: wallet.digitalWallet,
    };
  }


  // Transactions list with optional date filter
  async transactionsReport(from?: string, to?: string) {
    const where: any = {};
    if (from || to) where.timestamp = {};
    if (from) where.timestamp.gte = new Date(from);
    if (to) where.timestamp.lte = new Date(to);

    return this.prisma.transaction.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      include: {
        customer: { select: { name: true } },
      },
    });
  }
}