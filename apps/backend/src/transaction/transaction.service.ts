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
    });
  }

  async create(dto: CreateTransactionDto) {
    const { customerId, type, amount, note } = dto;
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      // fetch customer for validations
      const customer = await tx.customer.findUniqueOrThrow({
        where: { id: customerId }
      });


      switch (type) {
        case TransactionType.DEBT_COLLECTION:
          if (amount > customer.debtBalance) {
            throw new BadRequestException('Cannot collect more than the debt');
          }
          // decrement debt only
          await tx.customer.update({ where: { id: customerId }, data: { debtBalance: { decrement: amount } } });
          await tx.cashWallet.update({ where: { id: 1 }, data: { cashOnHand: { increment: amount } } });
          break;

        case TransactionType.CASH_COLLECTION:
          await tx.customer.update({ where: { id: customerId }, data: { cashBalance: { increment: amount } } });
          await tx.cashWallet.update({ where: { id: 1 }, data: { cashOnHand: { decrement: amount } } });
          break;

        case TransactionType.CASH_WITHDRAWAL:
          if (customer.cashBalance < amount) throw new BadRequestException('Insufficient cash balance');
          await tx.customer.update({ where: { id: customerId }, data: { cashBalance: { decrement: amount } } });
          await tx.cashWallet.update({ where: { id: 1 }, data: { cashOnHand: { decrement: amount } } });
          break;

        case TransactionType.ATM_DEPOSIT:
        case TransactionType.TRANSFER_IN:
          await tx.customer.update({
            where: { id: customerId },
            data: { walletBalance: { increment: amount } },
          });
          break;

        case TransactionType.CASH_DEPOSIT:
          await tx.customer.update({
            where: { id: customerId }, data: { cashBalance: { increment: amount } }
          });
          break;

        case TransactionType.TRANSFER_OUT:
          if (customer.walletBalance < amount) {
            throw new BadRequestException('Insufficient wallet balance');
          }
          await tx.customer.update({
            where: { id: customerId },
            data: { walletBalance: { decrement: amount } },
          });
          break;
        default:
          throw new BadRequestException('Invalid transaction type');
      }

      //create record after balance updates
      return tx.transaction.create({ data: { customerId, type, amount, note } });
    });
  }
}