import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  //
  const session = await getSession({
    req: req,
  });

  return res.status(200).send({ session });
});

export default handler;
