import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyProdsArr from "../../../dummy/mock/MOCK_DATA_PRODUCTS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
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
  for (const prod of dummyProdsArr) {
    const product = await prismaClient.product.create({
      data: { ...prod, admin: { connect: { id: admin.id } } },
    });

    console.log({ product });
  }

  return res.status(201).send("products created");
});

export default handler;
