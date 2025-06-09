import { Controller, Param, Post, Body, Get, Patch, Delete } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ParseIntPipe } from '@nestjs/common';

@Controller('customers')
export class CustomerController {
  constructor(private svc: CustomerService) { }

  @Get() findAll() { return this.svc.findAll(); }

  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Post() create(@Body() dto: CreateCustomerDto) {
    return this.svc.create(dto);
  }

  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCustomerDto
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}

