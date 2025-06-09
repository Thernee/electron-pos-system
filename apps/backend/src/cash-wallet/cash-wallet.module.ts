import { Module } from '@nestjs/common';
import { CashWalletService } from './cash-wallet.service';
import { CashWalletController } from './cash-wallet.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [CashWalletService, PrismaService],
  controllers: [CashWalletController],
})
export class CashWalletModule { }