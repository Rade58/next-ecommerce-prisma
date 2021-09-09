import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

// JUST FOR TRYPUT ************
/* handler.post(async (req, res) => {
  const body = req.body;

  console.log({ body });

  try {
    return res.status(200).send("hello world");
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
}); */
// *****************************

handler.put(async (req, res) => {
  const products = req.body as { productId: string; amount: number }[];

  if (!products) {
    return res.status(400).send("body is no good");
  }
  if (!products.length) {
    return res.status(200).send([]);
  }

  for (const item of products) {
    const product = await prismaClient.product.findUnique({
      where: {
        productId: item.productId,
      },
      select: {
        countInStock: true,
      },
    });

    if (!product) {
      return res.status(400).send("something wen wrong in for of loop");
    }

    await prismaClient.product.update({
      where: {
        productId: item.productId,
      },
      data: {
        countInStock: product.countInStock - item.amount,
      },
    });
  }

  return res.status(200).send("count updated");
});

/* handler.get(async (req, res) => {
  return res.status(200).send("FROM /PRODUCTS");
}); */

export default handler;
