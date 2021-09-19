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

  const orderIds: string[] = [];

  for (let i = 0; i <= 20; i++) {
    const order = await prismaClient.order.create({
      data: {
        buyer: {
          connect: {
            id: user.profiles[0].id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    orderIds.push(order.id);
  }

  // NOW LETS CREATE RELATED OrderElement RECORD FOR EVERY ORDER
  // WE BUILD SCHEMA LIKE THAT
  // WE ARE GOING TO LINK Order TO OrderElement
  // BUT WE ARE GOING TO SPECIFY AMOUNT ON OrderElement AND LINK Product TO OrderElement
  // THAT'S WHY WE ARE GOING TO LOOP THROUGH ORDER IDS

  for (let i = 0; i < orderIds.length; i++) {
    // WE NEED TO CREATE SOME AMOUT OF OrderElement RECORDS
    // FOR SOME ORDER

    for (let j = 0; j < products.length + 1; j++) {
      //

      const orderEl = await prismaClient.orderElement.create({
        data: {
          order: {
            connect: {
              id: orderIds[i],
            },
          },
          product: {
            connect: {
              productId: products[i].productId,
            },
          },
          // LET'S RANDOMIZE QUANTITY A BIT
          quantity: Math.round(Math.random() * 10) + 1,
        },
      });

      console.log(orderEl);
    }
  }

  return res.status(201).send("orders created");
});

export default handler;
