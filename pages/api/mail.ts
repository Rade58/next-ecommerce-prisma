import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  res.status(200).json("Hello World");
});

export default handler;
