import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyUsersArr from "../../../dummy/mock/MOCK_DATA_USERS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  for (const item of dummyUsersArr) {
    const newUser = await prismaClient.user.create({
      data: {
        ...item,
        emailVerified: new Date(item.emailVerified),
        profiles: {
          create: {
            role: "USER",
          },
        },
      },
    });

    console.log({ newUser });
  }

  return res.status(201).send("created");
});

export default handler;
