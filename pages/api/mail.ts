import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  // BECAUSE WE USE NEXT-CONNECT, body WILL BE PARSED
  // WE DON'T NEED TO USE JSON.parse
  const { body } = req;

  res.status(200).json("Hello World");
});

export default handler;
