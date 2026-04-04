import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const departments = ['RH', 'Engenharia', 'Vendas', 'Marketing', 'Operações'];
  const colors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

  console.log('Seeding departments...');
  for (let i = 0; i < departments.length; i++) {
    const dept = await prisma.department.findUnique({ where: { name: departments[i] } });
    if (!dept) {
      await prisma.department.create({ data: { name: departments[i], color: colors[i] } });
    }
  }

  const adminEmail = 'admin@pulsorh.com';
  const defaultPassword = 'PulsoRH@2026!';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    const rhDept = await prisma.department.findUnique({ where: { name: 'RH' } });
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin Master',
        role: 'ADMIN',
        departmentId: rhDept?.id,
        passwordHash,
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop',
      },
    });
    console.log('✅  Admin master initialized.');
  } else if (!existing.passwordHash) {
    const passwordHash = await bcrypt.hash(defaultPassword, 12);
    await prisma.user.update({ where: { email: adminEmail }, data: { passwordHash } });
    console.log('✅  Admin password hash updated.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
