import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  //
  const { prodId } = req.query;
  //

  console.log({ prodId });

  if (typeof prodId === "object") {
    return res.status(400).send("to many query params");
  }

  if (prodId === "products") {
    return res.status(400).send("wrong route");
  }

  try {
    const product = await prismaClient.product.findUnique({
      where: {
        productId: prodId,
      },
    });

    return res.status(200).send(product);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

handler.put(async (req, res) => {
  const { prodId } = req.query;

  if (typeof prodId === "object") {
    return res.status(400).send("to many query params");
  }

  const { amount, type } = req.body as {
    amount: number;
    type: "cart-add" | "cart-remove";
  };

  try {
    const product = await prismaClient.product.findUnique({
      where: {
        productId: prodId,
      },
      select: {
        countInStock: true,
      },
    });

    if (!product) {
      return res.status(400).send("no product");
    }

    if (type === "cart-add") {
      if (amount >= product.countInStock) {
        return res
          .status(400)
          .send("stock exceeded (higher than in stock value)");
      }

      const updatedProduct = await prismaClient.product.update({
        where: {
          productId: prodId,
        },
        data: {
          countInStock: product.countInStock - amount,
        },
      });

      return res.status(200).send(updatedProduct);
    }

    if (type === "cart-remove") {
      if (amount < 0) {
        return res.status(400).send("stock exceeded (lower than 0)");
      }

      const updatedProduct = await prismaClient.product.update({
        where: {
          productId: prodId,
        },
        data: {
          countInStock: product.countInStock + amount,
        },
      });

      return res.status(200).send(updatedProduct);
    }
  } catch (error) {
    console.error(error);

    return res.status(400).send("something went wrong");
  }
});

export default handler;
