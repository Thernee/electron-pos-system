import { Controller, Get, Post, Query, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from '@prisma/client';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly service: TransactionService) { }

  @Get()
  findAll(@Query('customerId') customerId?: string): Promise<Transaction[]> {
    const id = customerId ? parseInt(customerId, 10) : undefined;
    return this.service.findAll(id);
  }

  @Post()
  create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.service.create(dto);
  }
}