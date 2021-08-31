import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import prismaClient from "../../../lib/prisma";

import dummyUsersArr from "../../../dummy/mock/MOCK_DATA_USERS.json";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  for (const item of dummyUsersArr) {
    await prismaClient.user.create({
      data: {
        ...item,
        profiles: {
          create: {
            role: "USER",
          },
        },
      },
    });
  }

  return res.status(201).send("created");
});

export default handler;
