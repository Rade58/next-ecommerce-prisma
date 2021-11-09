import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyReviews from "../../../dummy/mock/MOCK_DATA_REVIEWS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // LETS QUERY FOR TWO USERS
  // THEY RE EACH GOING TO LEAVE A REVIEW

  const profile1 = (
    await prismaClient.profile.findMany({
      select: {
        id: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
      take: 10,
    })
  )[8];

  const profile2 = (
    await prismaClient.profile.findMany({
      select: {
        id: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
      take: 14,
    })
  )[12];

  // FIRST LETS QUERY FOR SOME PRODUCTS
  // 80 PRODUCTS WILL DO THE TRICK

  // AT THE END OF SEEDING WE SHOULD HAVE 80 REVIEWS FOR 80 PRODUCTS
  // FOR EVERY OF TWO USERS

  const products = await prismaClient.product.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: dummyReviews.length,
    select: {
      productId: true,
    },
  });

  // LETS CREATE ORDERS FOR THAT PRODUCTS

  let orderIds: string[] = [];

  for (let i = 0; i < 20; i++) {
    const order1 = await prismaClient.order.create({
      data: {
        buyerId: profile1.id,
        isDelivered: true,
        // LETS MARK ORDER AS DELIVERED
        deliveredAt: new Date(Date.now()),
      },
      select: {
        id: true,
      },
    });

    const order2 = await prismaClient.order.create({
      data: {
        buyerId: profile1.id,
        isDelivered: true,
        // LETS MARK ORDER AS DELIVERED
        deliveredAt: new Date(Date.now()),
      },
      select: {
        id: true,
      },
    });

    orderIds.push(order1.id, order2.id);
  }

  // LETS CREATE ORDER ELEMENTS

  for (let i = 0; i < orderIds.length; i++) {
    for (let j = 0; j < products.length; j++) {
      const orderEl = await prismaClient.orderElement.create({
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

  for (let i = 0; i < dummyReviews.length; i++) {
    const review = await prismaClient.review.create({
      data: {
        userId: profile1.id,
        productId: products[i].productId,
        comment: dummyReviews[i].comment,
        rating: dummyReviews[i].rating,
      },
    });

    console.log(review);
  }

  for (let i = dummyReviews.length - 1; i > 0; i--) {
    const review = await prismaClient.review.create({
      data: {
        userId: profile2.id,
        productId: products[i].productId,
        comment: dummyReviews[i].comment,
        rating: dummyReviews[i].rating,
      },
    });

    console.log(review);
  }

  return res.status(201).send("orders created");
});

export default handler;
