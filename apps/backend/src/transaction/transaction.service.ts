import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType, Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) { }

  async findAll(
    customerId?: number,
    type?: TransactionType,
    from?: Date,
    to?: Date
  ): Promise<Transaction[]> {
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (type) where.type = type;
    if (from || to) where.timestamp = {};
    if (from) where.timestamp.gte = from;
    if (to) where.timestamp.lte = to;

    return this.prisma.transaction.findMany({
      where,
      include: { customer: true },
      orderBy: { timestamp: 'desc' },
    });
  }

  async create(dto: CreateTransactionDto) {
    const { customerId, type, amount, note } = dto;
    if (amount <= 0) throw new BadRequestException('Amount must be positive');

    return this.prisma.$transaction(async (tx) => {
      // Update Customer and CashWallet based on type
      switch (type) {
        case TransactionType.ADD_CASH:
          await tx.customer.update({
            where: { id: customerId },
            data: { cashBalance: { increment: amount } },
          });
          await tx.cashWallet.update({
            where: { id: 1 },
            data: { cashOnHand: { increment: amount } },
          });
          break;
        case TransactionType.ADD_WALLET:
          await tx.customer.update({
            where: { id: customerId },
            data: { cashBalance: { increment: amount } },
          });
          await tx.cashWallet.update({
            where: { id: 1 },
            data: { digitalWallet: { increment: amount } },
          });
          break;
        case TransactionType.REMOVE_CASH:
          await tx.customer.update({
            where: { id: customerId },
            data: { cashBalance: { decrement: amount } },
          });
          await tx.cashWallet.update({
            where: { id: 1 },
            data: { cashOnHand: { decrement: amount } },
          });
          break;
        case TransactionType.REMOVE_WALLET:
          await tx.customer.update({
            where: { id: customerId },
            data: { cashBalance: { decrement: amount } },
          });
          await tx.cashWallet.update({
            where: { id: 1 },
            data: { digitalWallet: { decrement: amount } },
          });
          break;
        default:
          throw new BadRequestException('Unsupported transaction type');
      }

      // Create transaction record
      return tx.transaction.create({ data: { customerId, type, amount, note } });
    });
  }
}