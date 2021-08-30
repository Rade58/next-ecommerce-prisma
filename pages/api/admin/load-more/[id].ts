import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(verifyCurrentUser);

handler.post(async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(403).send("unauthorized");

  const body = req.body;

  // console.log(JSON.stringify({ id, body }, null, 2));

  if (body.model === "product") {
    try {
      const data = await prismaClient.product.findMany({
        take: 100,
        skip: 1,
        cursor: {
          productId: body.cursor,
        },
        where: {
          admin: {
            is: {
              id: id as string,
            },
          },
        },
      });

      console.log({ data });
      console.log({ len: data.length });

      return res.status(200).send(data);
    } catch (error) {
      console.error(error);

      return res.status(400).end();
    }
  }

  res.status(200).end();
});

export default handler;
