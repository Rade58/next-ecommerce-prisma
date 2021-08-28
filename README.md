# SEEDING PRODUCTS

I TOLD YOU THAT I'M STARTTING WITH USERS FIRST

BUT I THINK IT IS EASIER FOR ME TO SEED PRODUCTS (AND AFTER THAT I'M GOING TO BUILD PRODUCTS TABLE WITH PAGINATION)

## HELPFUL LINK FOR SEEDING

<https://www.prisma.io/docs/guides/database/seed-database>

**BUT I HAD PROBLEMS TO MAKE THIS WORK**

**SO I DECIDED TO MAKE ROUTE FOR SEEDING PRODUCTS**

I'M GOING TO USE THAT ROUTE ONLY ONE OFCOURSES

# FIRST I MADE MOCK PRODUCTS BY USING ONLINE TOOL

FIRST I USED <https://www.mockaroo.com/> TO MAKE BUNCH OF PRODUCTS

HERE IS THE JSON FILE `dummy/mock/MOCK_DATA.json`

# MAKING SEEDING ROOUTE FOR PRODUCTS

FILE `pages/api/mock/seed-products.ts`

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyProdsArr from "../../../dummy/mock/MOCK_DATA.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // WE HAVE ONE USER, ONE PROFILE
  // WE CREATED AND ALTER IT TO HAVE  ADMIN ROLE
  // BUT WE NEED TO GET HIS ID FIRST

  const user = await prismaClient.user.findUnique({
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

  const profileId = user?.profiles[0].id;

  if (!profileId) {
    return res.status(400).send("Something went wrong");
  }

  const admin = await prismaClient.profile.findUnique({
    where: {
      id: profileId,
    },
    select: {
      id: true,
    },
  });

  if (!admin) {
    return res.status(400).send("No such admin");
  }

  // NOW WE CAN CREATE PRODUCTS
  for await (const prod of dummyProdsArr) {
    prismaClient.product.create({
      data: { ...prod, admin: { connect: { id: admin.id } } },
    });
  }

  return res.status(201).send("products created");
});

export default handler;
```

WE CAN HIT THE ROUTE TO CREATE BUNCH OF PRODUCTS

```
yarn dev
```

USING HTTPIE TO HIT THE ROUTE

```
http GET :3000/api/mock/seed-products
```

## OPEN PRISMA STUDIO TO SEE IF PRODUCTS ARE CREATED, AND TO SEE IF THEY ARE LINKED WITH ADMIN PROFILE

```
yarm prisma:studio
```

YES I HAVE A LOT OF Product RECORDARIGHT NOW AND THEY ARE ALL LINKED WITH FORGEIN KEY WITH A ADMIN PROFILE