import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

// I ADDED MIDDLEWARE LIKE YOU SEE
handler.use(verifyCurrentUser);

// CREATING ORDER
handler.post(async (req, res) => {
  //
  const { orderId } = req.query;
  //
  const body = req.body;

  console.log({ orderId, body });

  // WE NEED TO UPDATE Profile AND User RECORD

  const {} = body as {
    //
  };

  try {
    const data = "";

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

// GETTING ORDER
handler.get(async (req, res) => {
  const { orderId } = req.query;

  try {
    const data = "";

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
