import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  //
  const { prodId } = req.query;
  //

  console.log({ prodId });

  try {
    const product = prismaClient.product.findUnique({
      where: {
        productId: prodId as string,
      },
    });

    return res.status(200).send(product);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
