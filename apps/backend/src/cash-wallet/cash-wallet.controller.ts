import { Controller, Get, Patch, Body } from '@nestjs/common';
import { CashWalletService } from './cash-wallet.service';
import { AdjustCashDto } from './dto/adjust-cash.dto';
import { CashWallet } from '@prisma/client';

@Controller('cash-wallet')
export class CashWalletController {
  constructor(private readonly service: CashWalletService) { }

  @Get()
  get(): Promise<CashWallet> {
    return this.service.get();
  }

  @Patch()
  adjust(@Body() dto: AdjustCashDto): Promise<CashWallet> {
    return this.service.adjust(dto);
  }
}