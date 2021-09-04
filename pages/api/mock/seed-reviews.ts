import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyReviews from "../../../dummy/mock/MOCK_DATA_REVIEWS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // FIRST LETS QUERY FOR SOME PRODUCTS
  // FIRST 10 PRODUCTS WILL DO THE TRICK

  return res.status(201).send("orders created");
});

export default handler;
