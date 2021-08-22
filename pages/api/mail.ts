import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const b = req.body;

  console.log(typeof b);

  console.log({ body: b });

  res.status(200).json("Hello World");
});

export default handler;
