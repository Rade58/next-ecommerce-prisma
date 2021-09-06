import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";
import { supabase as supaClient } from "../../../lib/supabase";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { text } = req.body as { text: string };

  try {
    const slugs = await prismaClient.product.findMany({
      where: {
        name: {
          contains: text,
        },
      },
      select: {
        name: true,
        productId: true,
      },
    });

    return res.status(200).json("some");
  } catch (err) {
    console.error(err);

    return res.status(400).send("something wen wrong");
  }
});

export default handler;
