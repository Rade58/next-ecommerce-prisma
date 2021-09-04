import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyReviews from "../../../dummy/mock/MOCK_DATA_REVIEWS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // LETS QUERY FOR ONLY ONE USER
  // HE IS GOING TO LEAVE ALL THE REVIEWS

  // FIRST LETS QUERY FOR SOME PRODUCTS
  // FIRST 20 PRODUCTS WILL DO THE TRICK

  // LETS CREATE ORDERS FOR THAT PRODUCTS

  // LETS MARK ORDERS AS DELIVERED

  // AND NOW WE CAN CREATE REVIEWS

  /* const products = await prismaClient.product.findMany({

  }) */

  return res.status(201).send("orders created");
});

export default handler;
