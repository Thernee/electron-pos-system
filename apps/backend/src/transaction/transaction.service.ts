import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateTransactionDto) {
    const { customerId, type, amount, note } = dto;
    if (amount <= 0) {
      throw new BadRequestException('Amount must be positive');
    }

    return this.prisma.$transaction(async (tx) => {
      // Create transaction record
      const record = await tx.transaction.create({ data: { customerId, type, amount, note } });

      // Update customer balances based on type
      const updateData: any = {};
      switch (type) {
        case TransactionType.CASH_DEPOSIT:
          updateData.cashBalance = { increment: amount };
          break;
        case TransactionType.ATM_DEPOSIT:
        case TransactionType.TRANSFER_IN:
          updateData.walletBalance = { increment: amount };
          break;
        case TransactionType.CASH_WITHDRAWAL:
        case TransactionType.TRANSFER_OUT:
          updateData.walletBalance = { decrement: amount };
          break;
        case TransactionType.ATM_DEDUCTION:
        case TransactionType.CASH_COLLECTION:
          updateData.cashBalance = { decrement: amount };
          // TODO: change ATM_DEDUCTION to a more descriptive name
          if (type === TransactionType.ATM_DEDUCTION) {
            updateData.debtBalance = { increment: amount };
          }
          break;
      }

      await tx.customer.update({ where: { id: customerId }, data: updateData });

      // Update admin CashWallet accordingly
      // review this logic
      const walletUpdate: any = {};
      if (type === TransactionType.CASH_DEPOSIT) {
        walletUpdate.cashOnHand = { decrement: amount }; // admin took cash into the system
      } else if (type === TransactionType.CASH_WITHDRAWAL) {
        walletUpdate.cashOnHand = { increment: amount }; // admin gives cash out
      } else if (type === TransactionType.TRANSFER_IN) {
        walletUpdate.digitalWallet = { decrement: amount }; // customer took digital funds
      } else if (type === TransactionType.TRANSFER_OUT) {
        walletUpdate.digitalWallet = { increment: amount }; // admin took digital funds
      }
      if (Object.keys(walletUpdate).length) {
        await tx.cashWallet.update({ where: { id: 1 }, data: walletUpdate });
      }

      return record;
    });
  }
}