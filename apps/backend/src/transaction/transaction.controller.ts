import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '@prisma/client';
import { TransactionType } from '@prisma/client';

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
}