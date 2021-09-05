import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { prodId } = req.query;

  if (typeof prodId === "object") {
    return res.status(400).end();
  }

  //
  // GET THE USER FIRST, CHECK IF HE ISN'T BANNED
  // CHECK IF HE ACTUALLY BUYED A PRODUCT
  // CHECK IF HE ALREADY MADE A REVIEW
});

export default handler;
