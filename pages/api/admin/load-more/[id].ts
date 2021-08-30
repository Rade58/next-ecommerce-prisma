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

  console.log(JSON.stringify({ id, body }, null, 2));

  res.status(200).end();
});

export default handler;
