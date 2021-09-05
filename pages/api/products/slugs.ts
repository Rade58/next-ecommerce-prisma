import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { text } = req.body as { text: string };

  try {
    const slugs = await prismaClient.$queryRaw<
      { value: string; label: string }[]
    >(/* sql */ `
      SELECT "public"."Product"."productId" AS value,
            name AS label FROM "public"."Product"
      WHERE to_tsvector(name) @@ to_tsquery(${text});
    `);

    return res.status(200).json(slugs);
  } catch (err) {
    console.error(err);

    return res.status(400).send("something wen wrong");
  }
});

export default handler;
