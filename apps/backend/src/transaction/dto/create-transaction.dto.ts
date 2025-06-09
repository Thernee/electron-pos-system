import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsNumber()
  customerId!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsOptional()
  note?: string;
}