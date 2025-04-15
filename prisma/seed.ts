import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.mesa.createMany({
    data: [
      { numero: 1 },
      { numero: 2 },
      { numero: 3 },
      { numero: 4 },
    ],
  });

  console.log("Mesas criadas com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
