import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CashWallet } from '@prisma/client';
import { AdjustCashDto } from './dto/adjust-cash.dto';

@Injectable()
export class CashWalletService {
  constructor(private prisma: PrismaService) { }

  async get(): Promise<CashWallet> {
    const wallet = await this.prisma.cashWallet.findUnique({ where: { id: 1 } });
    if (!wallet) {
      throw new NotFoundException('CashWallet not initialized');
    }
    return wallet;
  }

  async adjust(dto: AdjustCashDto): Promise<CashWallet> {
    return this.prisma.cashWallet.update({
      where: { id: 1 },
      data: {
        cashOnHand: dto.cashOnHand !== undefined ? dto.cashOnHand : undefined,
        digitalWallet:
          dto.digitalWallet !== undefined ? dto.digitalWallet : undefined,
      },
    });
  }
}