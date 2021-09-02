import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

import type { UpdateProductsDataRecord } from "../../../components/4_admin_page/ProductsTable";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use(verifyCurrentUser);

handler.post(async (req, res) => {
  //
});

export default handler;
