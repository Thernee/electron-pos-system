import { Injectable, NotFoundException } from '@nestjs/common';
import { StorageService, CashWallet } from '../storage/storage.service';
import { AdjustCashDto } from './dto/adjust-cash.dto';

@Injectable()
export class CashWalletService {
  constructor(private storage: StorageService) { }

  /** Get the singleton CashWallet record */
  async get(): Promise<CashWallet> {
    const wallet = this.storage.getCashWallet();
    if (!wallet) {
      throw new NotFoundException('CashWallet not initialized');
    }
    return wallet;
  }

  /** Override cashOnHand and/or digitalWallet */
  async adjust(dto: AdjustCashDto): Promise<CashWallet> {
    const wallet = this.storage.getCashWallet();
    if (!wallet) {
      throw new NotFoundException('CashWallet not initialized');
    }

    // Apply adjustments if provided
    const updated: CashWallet = {
      ...wallet,
      cashOnHand: dto.cashOnHand !== undefined ? dto.cashOnHand : wallet.cashOnHand,
      digitalWallet:
        dto.digitalWallet !== undefined ? dto.digitalWallet : wallet.digitalWallet,
      lastUpdated: new Date().toISOString(),
    };

    this.storage.saveCashWallet(updated);
    return updated;
  }
}
