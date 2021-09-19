// ------------------THIS FILE
// ------------------ IS NO OP
// ------------------ I COULDN'T MADE THIS WORK
// ------------------
// ------------------

// import { PrismaClient } from "@prisma/client";

import prisma from "../lib/prisma";

import mockProd from "./mock/MOCK_DATA.json";

// const prisma = new PrismaClient();

async function main() {
  const ajovUser = await prisma.user.findUnique({
    where: {
      email: "ajovaska@protonmail.com",
    },
    select: {
      profiles: {
        select: {
          id: true,
        },
      },
    },
  });

  const ajovProfile = await prisma.profile.findUnique({
    where: {
      id: ajovUser?.profiles[0].id,
    },
    select: {
      id: true,
    },
  });

  const ajov = await prisma.user.upsert({
    where: {
      email: "ajovaska@protonmail.com",
    },
    update: {},
    create: {
      profiles: {
        connect: {
          id: ajovProfile?.id,
        },
        create: {
          productCreationHistory: {
            create: [
              {
                price: 20,
                name: "Nice Product",
                brand: "Nike",
                countInStock: 30,
                description: "hello product how are",
                image: "",
              },
              ...mockProd,
            ],
          },
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
