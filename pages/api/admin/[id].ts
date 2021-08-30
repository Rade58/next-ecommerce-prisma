import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(verifyCurrentUser);

handler.delete(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  if (body.model === "product") {
    const productIdsArray = body.data as string[];

    try {
      let resArr = [];

      for (const productId of productIdsArray) {
        const resData = await prismaClient.product.delete({
          where: {
            productId,
          },
        });
        resArr.push(resData);
      }

      console.log(JSON.stringify(resArr, null, 2));

      return res.status(200).send("deleted");
    } catch (err) {
      console.error(err);
      return res.status(400).end();
    }
  }

  console.log(JSON.stringify({ id, body }, null, 2));

  res.status(200).end();
});

handler.put(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  // console.log(JSON.stringify({ id, body }, null, 2));

  // res.status(200).end();
});

handler.post(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  // console.log(JSON.stringify({ id, body }, null, 2));

  // res.status(200).end();
});

export default handler;
