import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

// import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

// I ADDED MIDDLEWARE LIKE YOU SEE
// handler.use(verifyCurrentUser);

// PUT
handler.put(async (req, res) => {
  console.log({
    cookies: req.cookies,
  });

  //
  const { profId } = req.query;

  console.log({ profId });
  //
  const body = req.body;

  console.log({ id: profId, body });

  // WE NEED TO UPDATE Profile RECORD

  const paymentMethod = body as string;

  try {
    const data = await prismaClient.profile.update({
      where: {
        id: profId as string,
      },
      data: {
        paymentMethod,
      },
      select: {
        paymentMethod: true,
      },
    });

    return res.status(200).send(data.paymentMethod);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
