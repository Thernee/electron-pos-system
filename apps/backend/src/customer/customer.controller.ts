import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from '../storage/storage.service';

@Controller('customers')
export class CustomerController {
  constructor(private service: CustomerService) { }

  @Get()
  getAll(): Promise<Customer[]> {
    return this.service.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto
  ): Promise<Customer> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Customer> {
    return this.service.remove(id);
  }
}
