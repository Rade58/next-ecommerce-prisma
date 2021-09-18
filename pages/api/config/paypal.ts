import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  return res.status(200).send("pypal config");
});

export default handler;
