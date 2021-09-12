import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.put(async (req, res) => {
  // WE WILL SEND ENTIRE CART TO THE BACKEND

  const cart = req.body as Record<
    string,
    {
      productId: string;
      amount: number;
      countInStock: number;
      price: number;
    }
  >;

  if (!cart) {
    return res.status(400).send("body is no good");
  }
  if (!Object.keys(cart)) {
    return res.status(400).send("empty cart");
  }

  try {
    for (const key in cart) {
      const item = cart[key];

      if (item && item?.productId) {
        const product = await prismaClient.product.findUnique({
          where: {
            productId: item.productId,
          },
          select: {
            countInStock: true,
          },
        });

        if (!product) {
          return res.status(400).send("something wen wrong");
        }

        await prismaClient.product.update({
          where: {
            productId: item.productId,
          },
          data: {
            countInStock: product.countInStock + item.amount,
          },
        });
      }
    }

    return res.status(200).send("cart cleared");
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

export default handler;
