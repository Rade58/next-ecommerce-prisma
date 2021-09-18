import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { orderId: id } = req.query;

  if (!id) {
    return res.status(400).send("order id invalid");
  }

  try {
    // LETS GET THE ORDER

    const order = await prismaClient.order.findUnique({
      where: {
        id: id as string,
      },
    });

    return res.status(201).send(order);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
