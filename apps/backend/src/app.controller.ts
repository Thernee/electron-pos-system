import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('customers')
export class AppController {
  constructor(private readonly prisma: PrismaService) { }

  @Get()
  getCustomers() {
    return this.prisma.customer.findMany();
  }
}
