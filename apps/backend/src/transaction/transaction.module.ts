import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { StorageService } from '../storage/storage.service';

@Module({
  providers: [TransactionService, StorageService],
  controllers: [TransactionController],
})
export class TransactionModule { }