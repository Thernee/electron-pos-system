import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '../storage/storage.service';
import { TransactionType } from '../storage/storage.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

  @Get()
  findAll(
    @Query('customerId') customerId?: string,
    @Query('type') type?: TransactionType,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<Transaction[]> {
    const cid = customerId ? Number(customerId) : undefined;
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;
    return this.service.findAll(cid, type, fromDate, toDate);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.service.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    const txId = Number(id);
    await this.service.delete(txId);
  }

  @Delete()
  async clearAll(): Promise<void> {
    await this.service.clearAll();
  }
}