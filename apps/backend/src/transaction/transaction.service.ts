import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) { }

  findAll(customerId?: number): Promise<Transaction[]> {
    const where = customerId ? { customerId } : {};
    return this.prisma.transaction.findMany({
      where,
      include: { customer: true },
    });
  }

  async create(dto: CreateTransactionDto): Promise<Transaction> {
    const { customerId, type, amount, note } = dto;
    if (amount <= 0) {
      throw new BadRequestException('Transaction amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create transaction record
      const record = await tx.transaction.create({ data: { customerId, type, amount, note } });

      // 2. Update customer balance and debt
      const balanceDelta = type === TransactionType.CASH_COLLECTION ? amount : -amount;
      const debtDelta = type === TransactionType.ATM_DEDUCTION ? amount : 0;

      await tx.customer.update({
        where: { id: customerId },
        data: {
          balance: { increment: balanceDelta },
          totalDebt: { increment: debtDelta },
        },
      });

      // 3. Update cash wallet
      const walletUpdate: any = {};
      if (type === TransactionType.CASH_COLLECTION) {
        walletUpdate.cashOnHand = { increment: amount };
      }
      await tx.cashWallet.update({
        where: { id: 1 },
        data: walletUpdate,
      });

      return record;
    });
  }
}
