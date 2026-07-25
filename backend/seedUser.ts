import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'user@bioedu.uz';
  const password = 'user';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const existingUser = await prisma.user.findUnique({ where: { email } });
  
  if (existingUser) {
    console.log('User already exists');
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Oddiy',
      lastName: 'Foydalanuvchi',
      role: 'STUDENT',
    },
  });

  console.log(`Created Normal User: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
