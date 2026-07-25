const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeSuperAdmin() {
  await prisma.user.updateMany({
    data: {
      role: 'SUPER_ADMIN'
    }
  });
  console.log("All users are now SUPER_ADMIN");
}

makeSuperAdmin().catch(console.error).finally(() => prisma.$disconnect());
