import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

// GETTING ORDER
handler.get(async (req, res) => {
  const { orderId: id } = req.query;

  try {
    const order = prismaClient.order.findUnique({
      where: {
        id: id as string,
      },
      include: {
        buyer: true,
        items: true,
      },
    });

    return res.status(200).send(order);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
