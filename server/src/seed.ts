import bcrypt from 'bcryptjs';
import prisma from './config/database';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Criar categorias
  console.log('📁 Criando categorias...');
  const categories = [
    { name: 'Aeronaves', description: 'Aviões de combate e transporte', order: 1 },
    { name: 'Helicópteros', description: 'Helicópteros de ataque e transporte', order: 2 },
    { name: 'Blindados', description: 'Tanques e veículos blindados', order: 3 },
    { name: 'Embarcações', description: 'Navios e embarcações militares', order: 4 },
    { name: 'Artilharia', description: 'Sistemas de artilharia e canhões', order: 5 },
    { name: 'Mísseis', description: 'Sistemas de mísseis diversos', order: 6 },
    { name: 'Equipamentos Eletrônicos', description: 'Radares e sistemas eletrônicos', order: 7 },
    { name: 'Cocares', description: 'Insígnias e marcações militares', order: 8 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  console.log('✓ Categorias criadas com sucesso!\n');

  // Criar usuário admin padrão
  console.log('👤 Criando usuário administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@pvo.mil.br' },
    update: {},
    create: {
      email: 'admin@pvo.mil.br',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
  console.log('✓ Administrador criado com sucesso!');
  console.log('  Email: admin@pvo.mil.br');
  console.log('  Senha: admin123\n');

  // Criar usuário instrutor padrão
  console.log('👨‍🏫 Criando usuário instrutor...');
  const instructorPassword = await bcrypt.hash('instrutor123', 10);

  await prisma.user.upsert({
    where: { email: 'instrutor@pvo.mil.br' },
    update: {},
    create: {
      email: 'instrutor@pvo.mil.br',
      password: instructorPassword,
      name: 'Instrutor de Teste',
      role: 'INSTRUCTOR',
    },
  });
  console.log('✓ Instrutor criado com sucesso!');
  console.log('  Email: instrutor@pvo.mil.br');
  console.log('  Senha: instrutor123\n');

  // Criar usuário aluno padrão
  console.log('👨‍🎓 Criando usuário aluno...');
  const studentPassword = await bcrypt.hash('aluno123', 10);

  await prisma.user.upsert({
    where: { email: 'aluno@pvo.mil.br' },
    update: {},
    create: {
      email: 'aluno@pvo.mil.br',
      password: studentPassword,
      name: 'Aluno de Teste',
      role: 'STUDENT',
    },
  });
  console.log('✓ Aluno criado com sucesso!');
  console.log('  Email: aluno@pvo.mil.br');
  console.log('  Senha: aluno123\n');

  console.log('🎉 Seed concluído com sucesso!\n');
  console.log('═══════════════════════════════════════════════');
  console.log('Usuários de Teste Criados:');
  console.log('───────────────────────────────────────────────');
  console.log('1. ADMIN:');
  console.log('   Email: admin@pvo.mil.br');
  console.log('   Senha: admin123');
  console.log('');
  console.log('2. INSTRUTOR:');
  console.log('   Email: instrutor@pvo.mil.br');
  console.log('   Senha: instrutor123');
  console.log('');
  console.log('3. ALUNO:');
  console.log('   Email: aluno@pvo.mil.br');
  console.log('   Senha: aluno123');
  console.log('═══════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
