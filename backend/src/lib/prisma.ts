import { PrismaClient } from '@prisma/client';

// Bitta umumiy ulanish (har bir route alohida PrismaClient ochmasligi uchun)
export const prisma = new PrismaClient();
