import { PrismaClient, TransactionType } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with sample data...');

  // 1. Initialize admin wallet
  await prisma.cashWallet.upsert({
    where: { id: 1 },
    update: {},
    create: {
      cashOnHand: 10000,
      digitalWallet: 5000,
    },
  });

  // 2. Create customers with initial balances
  const alice = await prisma.customer.create({
    data: {
      name: 'Alice Anderson',
      email: 'alice@example.com',
      phone: '08012345678',
      cashBalance: 1000,
    },
  });
  const bob = await prisma.customer.create({
    data: {
      name: 'Bob Brown',
      email: 'bob@example.com',
      phone: '08023456789',
      cashBalance: 500,
    },
  });
  const carol = await prisma.customer.create({
    data: {
      name: 'Carol Clark',
      email: 'carol@example.com',
      phone: '08034567890',
      cashBalance: -50,
    },
  });
  const dave = await prisma.customer.create({
    data: {
      name: 'Dave Davis',
      email: 'dave@example.com',
      phone: '08045678901',
      cashBalance: 0,
    },
  });

  // 3. Seed transaction history
  await prisma.transaction.createMany({
    data: [
      // Alice transactions
      { customerId: alice.id, type: TransactionType.ADD_CASH, amount: 1000, note: 'Initial deposit' },
      { customerId: alice.id, type: TransactionType.REMOVE_CASH, amount: 200, note: 'ATM withdrawal' },
      { customerId: alice.id, type: TransactionType.ADD_WALLET, amount: 300, note: 'Mobile deposit' },
      { customerId: alice.id, type: TransactionType.REMOVE_WALLET, amount: 100, note: 'Online purchase' },

      // Bob transactions
      { customerId: bob.id, type: TransactionType.ADD_WALLET, amount: 500, note: 'Salary transfer' },

      // Carol transactions
      { customerId: carol.id, type: TransactionType.REMOVE_CASH, amount: 50, note: 'Cash withdrawal' },

      // Dave transactions
      { customerId: dave.id, type: TransactionType.ADD_CASH, amount: 250, note: 'Gift deposit' },
      { customerId: dave.id, type: TransactionType.REMOVE_WALLET, amount: 150, note: 'Bill payment' },
    ],
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
