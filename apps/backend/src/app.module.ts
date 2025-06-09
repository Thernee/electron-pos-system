import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CustomerController } from './customer/customer.controller';
import { CustomerService } from './customer/customer.service';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { CashWalletController } from './cash-wallet/cash-wallet.controller';
import { CashWalletService } from './cash-wallet/cash-wallet.service';
import { TransactionModule } from './transaction/transaction.module';
import { CashWalletModule } from './cash-wallet/cash-wallet.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [TransactionModule, CashWalletModule, CustomerModule],
  controllers: [AppController, CustomerController, TransactionController, CashWalletController],
  providers: [AppService, PrismaService, CustomerService, TransactionService, CashWalletService],
})
export class AppModule { }
