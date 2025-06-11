import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) { }

  findAll(customerId?: number) {
    const where = customerId ? { customerId } : {};
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
      // 1) Update Customer & CashWallet based on type
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

      // 2) Create transaction record
      return tx.transaction.create({ data: { customerId, type, amount, note } });
    });
  }
}