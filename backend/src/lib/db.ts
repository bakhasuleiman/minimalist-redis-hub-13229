import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

let db: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  db = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
  }
  db = global.__db;
}

export { db };