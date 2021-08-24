import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { id } = req.query;
  const body = req.body;

  console.log({ id, body });

  return res.status(200).send({ id, body });
});

export default handler;
