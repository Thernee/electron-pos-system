import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create customers
  const john = await prisma.customer.create({
    data: {
      name: 'John Doe',
      cardNumber: '1234-5678-9012-3456',
      email: 'john@example.com',
      phone: '08012345678',
      balance: 500,
      totalDebt: 200,
    },
  });

  const jane = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      cardNumber: '9876-5432-1098-7654',
      email: 'jane@example.com',
      phone: '08087654321',
      balance: 1500,
      totalDebt: 0,
    },
  });

  // Create transactions
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
    ],
  });

  // Set up CashWallet (create if not exists)
  await prisma.cashWallet.upsert({
    where: { id: 1 },
    update: {
      cashOnHand: 3000,
      digitalWallet: 7000,
    },
    create: {
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
