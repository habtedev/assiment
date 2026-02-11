import prisma from './prismaClient';
import bcrypt from 'bcrypt';

async function seedAdmin() {
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  let role = adminRole;
  if (!role) {
    role = await prisma.role.create({ data: { name: 'ADMIN' } });
  }
  const hashedPassword = await bcrypt.hash('changeme', 10);
  const user = await prisma.user.upsert({
    where: { email: 'HABTAMU.AMA@uog.edu.et' },
    update: {},
    create: {
      email: 'HABTAMU.AMA@uog.edu.et',
      name: 'Habtamu',
      password: hashedPassword,
      roleId: role.id,
    },
  });
  console.log('Seeded admin user:', user);
}

seedAdmin().then(() => {
  console.log('Admin seed complete');
  process.exit(0);
}).catch((err) => {
  console.error('Admin seed failed:', err);
  process.exit(1);
});
