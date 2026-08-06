const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: 'admin@gmail.com' } });
  if (!admin) {
    console.log('Admin not found');
    return;
  }
  
  // Set profile info and progress
  await prisma.user.update({
    where: { id: admin.id },
    data: { 
      firstName: 'Jahongir', 
      lastName: 'Xoliyorov', 
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jahongir',
      xp: 2850,
      level: 6,
      streak: 12
    }
  });
  
  // Create an achievement if possible
  const achievement = await prisma.achievement.findFirst();
  if (achievement) {
    await prisma.userAchievement.create({
      data: { userId: admin.id, achievementId: achievement.id }
    }).catch(() => {}); // ignore if exists
  }
  
  console.log('Admin seeded with data!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
