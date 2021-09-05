import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { prodId } = req.query;

  const { profileId, rating, comment } = req.body;

  console.log({ profileId, prodId, rating, comment });

  if (typeof prodId === "object") {
    return res.status(400).end();
  }

  return res.status(200).json([]);

  //
  // GET THE USER FIRST, CHECK IF HE ISN'T BANNED
  // CHECK IF HE ACTUALLY BUYED A PRODUCT
  // CHECK IF HE ALREADY MADE A REVIEW
});

export default handler;
