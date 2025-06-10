import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create customers with correct balance fields
  const john = await prisma.customer.create({
    data: {
      name: 'John Doe',
      cardNumber: '1234-5678-9012-3456',
      email: 'john@example.com',
      phone: '08012345678',
      cashBalance: 500,     // initial cash balance
      walletBalance: 0,     // initial wallet balance
      debtBalance: 200,     // initial debt
    },
  });

  const jane = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      cardNumber: '9876-5432-1098-7654',
      email: 'jane@example.com',
      phone: '08087654321',
      cashBalance: 1500,
      walletBalance: 0,
      debtBalance: 0,
    },
  });

  // Create some transactions related to customers
  await prisma.transaction.createMany({
    data: [
      {
        customerId: john.id,
        type: TransactionType.ATM_DEDUCTION,
        amount: 300,
        note: 'Purchase at ABC Store',
      },
      {
        customerId: john.id,
        type: TransactionType.CASH_COLLECTION,
        amount: 100,
        note: 'Cash repayment',
      },
      {
        customerId: jane.id,
        type: TransactionType.ATM_DEDUCTION,
        amount: 200,
        note: 'Supermarket transaction',
      },
      {
        customerId: jane.id,
        type: TransactionType.CASH_DEPOSIT,
        amount: 500,
        note: 'Deposit from paycheck',
      },
      {
        customerId: john.id,
        type: TransactionType.TRANSFER_IN,
        amount: 150,
        note: 'Transfer from Jane',
      },
    ],
  });

  // Upsert CashWallet with initial values
  await prisma.cashWallet.upsert({
    where: { id: 1 },
    update: {
      cashOnHand: 3000,
      digitalWallet: 7000,
    },
    create: {
      id: 1,
      cashOnHand: 3000,
      digitalWallet: 7000,
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
