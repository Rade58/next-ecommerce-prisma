import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { prodId } = req.query;

  const { profileId, rating, comment } = req.body;

  console.log({ profileId, prodId, rating, comment });

  if (typeof prodId === "object") {
    return res.status(400).end();
  }

  // GET THE USER FIRST, CHECK IF HE ISN'T BANNED

  const profile = await prismaClient.profile.findUnique({
    where: {
      id: profileId as string,
    },
    select: {
      role: true,
      id: true,
    },
  });

  if (profile?.role === "BANNED") {
    return res.status(400).end();
  }

  // WE CHECK IF USER BUYED A PRODUCT
  // IF THERE IS FULLFILLED ORDER
  // (FOR OUR EXAMPLE WE DON'T WANT TO OVER COMPLICATE THINGS
  // SO WE ARE GOING TO DISSALLOW REVING IF ORDER ISN'T
  //  DELIVERED)

  // THIS QUERY IS GOING TO BE A LITTLE COMPLICATED
  // BUT IT IS EASY TO MAKE WITH PRISMA

  const orders = await prismaClient.order.count({
    where: {
      buyerId: profileId as string,
      items: {
        every: {
          product: {
            productId: {
              equals: prodId,
            },
          },
        },
      },
      isDelivered: {
        equals: true,
      },
    },
  });

  console.log({ orders });

  if (!orders) {
    return res.status(400).send("User didn't buy a product.");
  }

  // WE NEED TO QUERY FOR REVIEWS AND TO FIND OUT IF USER ALREADY MADE A REVIEW
  const product = await prismaClient.product.findUnique({
    where: {
      productId: prodId as string,
    },
    select: {
      reviews: {
        where: {
          user: {
            id: {
              equals: profileId as string,
            },
          },
        },
      },
    },
  });

  console.log({ product, profile });

  if (product?.reviews && product.reviews.length > 0) {
    return res.status(400).send("User alredy mada a review for this product");
  }

  // NOW WE CAN MAKE AN REVIEW

  const newReview = await prismaClient.review.create({
    data: {
      comment,
      rating,
      user: {
        connect: {
          id: profile?.id || "",
        },
      },
      product: {
        connect: {
          productId: prodId,
        },
      },
    },
  });

  // NOW LET'S GET ALL REVIEWS OF THE PRODUCT AND SEND THEM BACK
  const revs = await prismaClient.review.findMany({
    where: {
      productId: prodId,
    },
    select: {
      comment: true,
      rating: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  let rateSum = 0;

  revs.forEach((rev) => {
    rateSum = rateSum + rev.rating;
  });

  // UPDATE AVERAGE
  const updatedProduct = await prismaClient.product.update({
    where: {
      productId: prodId,
    },
    data: {
      rating: rateSum / revs.length,
    },
  });

  return res.status(200).json(revs);
});

export default handler;
