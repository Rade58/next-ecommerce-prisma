import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

const handler = nc<NextApiRequest, NextApiResponse>();

// I ADDED MIDDLEWARE LIKE YOU SEE
handler.use(verifyCurrentUser);

handler.post(async (req, res) => {
  const { id } = req.query;
  const body = req.body;

  console.log({ id, body });

  // WE NEED TO UPDATE Profile AND User RECORD

  return res.status(200).send({ id, body });
});

export default handler;
