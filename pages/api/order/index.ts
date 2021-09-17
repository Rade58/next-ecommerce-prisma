import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

import type { BodyDataI } from "../../../components/7_place_order_page/SummaryList";

const handler = nc<NextApiRequest, NextApiResponse>();

// CREATING ORDER
handler.post(async (req, res) => {
  const body = req.body;

  console.log({ body });

  const { buyerId, cart, shippingPrice, taxPrice } = body as BodyDataI;

  // AGAIN WE NEED TO CALCULATE AND WE WILL STORE TOTAL PRICE ON
  // ORDER OBJECT

  try {
    const data = "";

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
