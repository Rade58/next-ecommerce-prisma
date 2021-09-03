import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyProdsArr from "../../../dummy/mock/MOCK_DATA_PRODUCTS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // FIRST LETS GET USER FOR WHOOM WE ARE CREATING ORDERS
  const user = await prismaClient.user.findUnique({
    where: {
      email: "bajic.rade2@gmail.com",
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
    return res
      .status(400)
      .send("Something went wrong (There is no user (Profilerecord))");
  }

  // NOW WE CAN QUERY FOR SOME AMOUNT OF PRODUCTS
  // WE DON'T NEED TO GET CREAZY WITH THIS QUERY
  // 10 PRODUCTS SHOULD BE ENOUGH
  //

  const products = await prismaClient.product.findMany({
    select: {
      productId: true,
    },
    take: 10,
  });

  // WE WILL CREATE SOME AMOUNT OF Order RECORDS

  const orders = await prismaClient.order.create({
    data: {
      buyer: {
        connect: {
          id: user.profiles[0].id,
        },
      },
    },
  });

  return res.status(201).send("orders created");
});

export default handler;
