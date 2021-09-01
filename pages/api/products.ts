import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { cursor } = req.body as { cursor: string };

  try {
    const products = await prismaClient.product.findMany({
      cursor: {
        productId: cursor,
      },
      take: 18,
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        productId: true,
        adminId: true,
        name: true,
        image: true,
        description: true,
        brand: true,
        category: true,
        price: true,
        countInStock: true,
        rating: true,
        numReviews: true,
      },
    });

    console.log({ products });

    return res.status(200).json(products);
  } catch (err) {
    console.error(err);

    return res.status(400).send("something wen wrong");
  }
});

export default handler;
