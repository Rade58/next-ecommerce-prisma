import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import verifyCurrentUser from "../../../middlewares/verifyCurrentUser";

import prismaClient from "../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

// I ADDED MIDDLEWARE LIKE YOU SEE
handler.use(verifyCurrentUser);

handler.put(async (req, res) => {
  //
  const { id } = req.query;
  //
  const body = req.body;

  console.log({ id, body });

  // WE NEED TO UPDATE Profile AND User RECORD

  const { name, addrss, city, country, postalCode, taxPrice } = body as {
    name: string;
    country: string;
    city: string;
    postalCode: string;
    addrss: string;
    taxPrice: string;
  };

  try {
    const { id: profileId, userId } = await prismaClient.profile.update({
      where: {
        id: id as string,
      },
      data: {
        addrss,
        city,
        country,
        postalCode,
        taxPrice: Number(taxPrice),
        user: {
          update: {
            name,
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    return res
      .status(200)
      .send(`UPDATED user: ${userId} and profile: ${profileId}`);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
