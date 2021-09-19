import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const text = req.query.text as string;

  try {
    const slugs = (
      await prismaClient.product.findMany({
        where: {
          name: {
            contains: text,
            mode: "insensitive",
          },
        },
        select: {
          name: true,
          productId: true,
        },
      })
    ).map((prod) => ({ value: prod.productId, label: prod.name }));

    // console.log({ slugs, text });

    return res.status(200).json(slugs);
  } catch (err) {
    console.error(err);

    return res.status(400).send("something wen wrong");
  }
});

export default handler;
