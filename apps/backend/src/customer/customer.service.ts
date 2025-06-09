import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) { }

  findAll() {
    return this.prisma.customer.findMany({
      include: { transactions: true },
    });
  }

  findOne(id: number) {
    return this.prisma.customer.findUniqueOrThrow({
      where: { id },
      include: { transactions: true },
    });
  }

  create(data: CreateCustomerDto) {
    return this.prisma.customer.create({ data });
  }

  update(id: number, data: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.customer.delete({ where: { id } });
  }
}

