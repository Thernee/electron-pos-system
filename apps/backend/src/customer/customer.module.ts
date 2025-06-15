import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { StorageService } from '../storage/storage.service';
@Module({
  providers: [CustomerService, StorageService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule { }