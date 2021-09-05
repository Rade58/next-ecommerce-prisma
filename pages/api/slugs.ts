import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { cursor } = req.body as { cursor: string };

  try {
    const slugs = await prismaClient.$queryRaw(/* sql */ `
      SELECT productId AS value, name AS label FROM products;
    `);

    console.log({ slugs });

    return res.status(200).json(slugs);
  } catch (err) {
    console.error(err);

    return res.status(400).send("something wen wrong");
  }
});

export default handler;
