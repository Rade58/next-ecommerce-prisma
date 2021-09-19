import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // WE ARE JUST SENDING PAYPAL CLIENT ID BACK

  // BUT LET'S SECURE THIS
  // LETS CHECK FOR SESSION
  const session = await getSession({
    req: req,
  });

  console.log({ session });

  if (!session) {
    return res.status(401).send("NOT AUTHENTICATED");
  }

  return res.status(200).send(process.env.PAYPAL_CLIENT_ID);
});

export default handler;
