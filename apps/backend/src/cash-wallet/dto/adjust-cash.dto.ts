import { IsNumber, IsOptional } from 'class-validator';

export class AdjustCashDto {
  @IsOptional()
  @IsNumber()
  cashOnHand?: number;

  @IsOptional()
  @IsNumber()
  digitalWallet?: number;
}