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
  const { profileId } = req.query;

  console.log({ profileId });
  //
  const body = req.body;

  console.log({ id: profileId, body });

  // WE NEED TO UPDATE Profile AND User RECORD

  const { name, addrss, city, country, postalCode } = body as {
    name: string;
    country: string;
    city: string;
    postalCode: string;
    addrss: string;
  };

  try {
    const data = await prismaClient.profile.update({
      where: {
        id: profileId as string,
      },
      data: {
        addrss,
        city,
        country,
        postalCode,
        user: {
          update: {
            name,
          },
        },
      },
      select: {
        addrss: true,
        city: true,
        country: true,
        postalCode: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).send(data);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
