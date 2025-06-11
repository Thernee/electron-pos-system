import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) { }

  @Get('customer-balances')
  getCustomerBalances() {
    return this.reports.customerBalances();
  }

  @Get('admin-summary')
  getAdminSummary() {
    return this.reports.adminSummary();
  }

  @Get('transactions')
  getTransactions(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reports.transactionsReport(from, to);
  }
}