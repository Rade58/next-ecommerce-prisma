import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyReviews from "../../../dummy/mock/MOCK_DATA_REVIEWS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // LETS QUERY FOR ONLY ONE USER
  // HE IS GOING TO LEAVE ALL THE REVIEWS

  const profile = (
    await prismaClient.profile.findMany({
      where: {
        user: {
          email: {
            equals: "bajic.rade2@gmail.com",
          },
        },
      },
      select: {
        id: true,
      },
    })
  )[0];

  // FIRST LETS QUERY FOR SOME PRODUCTS
  // FIRST 5 PRODUCTS WILL DO THE TRICK

  const products = await prismaClient.product.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
    select: {
      productId: true,
    },
  });

  // LETS CREATE ORDERS FOR THAT PRODUCTS

  let orderIds: string[] = [];

  for (let i = 0; i < 30; i++) {
    const order = await prismaClient.order.create({
      data: {
        buyerId: profile.id,
        isDelivered: true,
        // LETS MARK ORDER AS DELIVERED
        deliveredAt: new Date(Date.now()),
      },
      select: {
        id: true,
      },
    });

    orderIds.push(order.id);
  }

  // LETS CREATE ORDER ELEMENTS

  for (let i = 0; i < orderIds.length; i++) {
    for (let j = 0; j < products.length; j++) {
      const orderEls = await prismaClient.orderElement.create({
        data: {
          productId: products[j].productId,
          orderId: orderIds[i],
          //
          quantity: Math.round(Math.random() * 10) + 1,
        },
      });
    }
  }

  // AND NOW WE CAN CREATE REVIEWS

  /* const products = await prismaClient.product.findMany({

  }) */

  return res.status(201).send("orders created");
});

export default handler;
