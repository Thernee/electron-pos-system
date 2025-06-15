import { Module } from '@nestjs/common';
import { CashWalletService } from './cash-wallet.service';
import { CashWalletController } from './cash-wallet.controller';
import { StorageService } from '../storage/storage.service';
@Module({
  providers: [CashWalletService, StorageService],
  controllers: [CashWalletController],
})
export class CashWalletModule { }