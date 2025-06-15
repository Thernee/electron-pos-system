import { Controller, Get } from '@nestjs/common';
import { StorageService, Customer } from './storage/storage.service';

@Controller('customers')
export class AppController {
  constructor(private readonly storage: StorageService) { }

  @Get()
  getCustomers(): Customer[] {
    // simply return the array from our JSON store
    return this.storage.getCustomers();
  }
}
