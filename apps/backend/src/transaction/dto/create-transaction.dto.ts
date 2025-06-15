import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../../storage/storage.service';

export class CreateTransactionDto {
  @IsNumber()
  customerId!: number;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  note?: string;
}