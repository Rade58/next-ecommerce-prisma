import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

// HIT THIS ON EVERY
// 'ADD TO CART UI' MOUNTING
handler.get(async (req, res) => {
  const { prodId } = req.query;

  // console.log({ prodId });

  if (typeof prodId === "object") {
    return res.status(400).send("to many query params");
  }

  if (prodId === "products") {
    // THIS WILL NEVER HAPPEN (BUT I MANAGE IT)
    return res.status(400).send("wrong route");
  }

  try {
    const product = await prismaClient.product.findUnique({
      where: {
        productId: prodId,
      },
    });

    // RETURNING ENTIRE PRODUCT RECORD
    return res.status(200).send(product);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

// HIT THIS EVERY TIME THERE IS YOU MAKE UPDATE
handler.put(async (req, res) => {
  const { prodId } = req.query;

  if (typeof prodId === "object") {
    return res.status(400).send("to many query params");
  }

  if (prodId === "products") {
    // THIS WILL NEVER HAPPEN (BUT I MANAGE IT)
    return res.status(400).send("wrong route");
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
    });

    if (!product) {
      return res.status(400).send("no product");
    }

    if (type === "cart-add") {
      if (product.countInStock === 0) {
        // WE WON'T BE SENDING ERRORS
        // BUT LETS NOT UPDATE ANYTHING
        // LETS JUST SEND A RECORD BACK

        return res.status(200).json(product);
      }

      const updatedProduct = await prismaClient.product.update({
        where: {
          productId: prodId,
        },
        data: {
          countInStock: product.countInStock - amount,
        },
        // DON'T CHERRY-PICK
        // TAKE ENTIRE RECORD (I DID)
      });

      console.log({ updatedProduct });

      return res.status(200).send(updatedProduct);
    }

    if (type === "cart-remove") {
      if (amount < 0) {
        // WE WON'T BE SENDING ERRORS
        // BUT LETS NOT UPDATE ANYTHING
        // LETS JUST SEND A RECORD BACK

        return res.status(200).json(product);
      }

      const updatedProduct = await prismaClient.product.update({
        where: {
          productId: prodId,
        },
        data: {
          countInStock: product.countInStock + amount,
        },
        // TAKING ENTIRE PRODUCT HERE TOO
      });

      console.log(updatedProduct);

      return res.status(200).json(updatedProduct);
    }

    if (type === "clear-product") {
      const updatedProduct = await prismaClient.product.update({
        where: {
          productId: prodId,
        },
        data: {
          countInStock: product.countInStock + amount,
        },
      });

      console.log(updatedProduct);

      return res.status(200).json(updatedProduct);
    }
  } catch (error) {
    console.error(error);

    return res.status(400).send("something went wrong");
  }
});

export default handler;
