import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  StorageService,
  Customer,
  Transaction,
} from '../storage/storage.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private storage: StorageService) { }

  /** Return all customers */
  async findAll(): Promise<Customer[]> {
    return this.storage.getCustomers();
  }

  /** Return one customer, including their transactions */
  async findOne(id: number): Promise<Customer & { transactions: Transaction[] }> {
    const customers = this.storage.getCustomers();
    const cust = customers.find(c => c.id === id);
    if (!cust) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    const transactions = this.storage.getTransactions().filter(t => t.customerId === id);
    return { ...cust, transactions };
  }

  /** Create a new customer */
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const customers = this.storage.getCustomers();
    const nextId = customers.length ? Math.max(...customers.map(c => c.id)) + 1 : 1;

    const now = new Date().toISOString();
    const newCust: Customer = {
      id: nextId,
      name: dto.name,
      cardNumber: dto.cardNumber,
      email: dto.email,
      phone: dto.phone,
      cashBalance: 0,
      createdAt: now,
      updatedAt: now,
    };

    customers.push(newCust);
    this.storage.saveCustomers(customers);
    return newCust;
  }

  /** Update an existing customer */
  async update(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const customers = this.storage.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Customer ${id} not found`);
    }

    const updated: Customer = {
      ...customers[idx],
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    customers[idx] = updated;
    this.storage.saveCustomers(customers);
    return updated;
  }

  /** Remove a customer and their transactions */
  async remove(id: number): Promise<Customer> {
    const customers = this.storage.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) {
      throw new NotFoundException(`Customer ${id} not found`);
    }
    const transactions = this.storage.getTransactions().filter(t => t.customerId === id);
    if (transactions.length > 0) {
      throw new BadRequestException('Cannot delete customer with existing transactions. Please delete their transactions first.');
    }
    const [removed] = customers.splice(idx, 1);
    this.storage.saveCustomers(customers);
    return removed;
  }
}
