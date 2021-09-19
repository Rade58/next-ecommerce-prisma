import type { Middleware } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

import prismaClient from "../lib/prisma";

const verifyCurrentUser: Middleware<NextApiRequest, NextApiResponse> = async (
  req,
  res,
  next
) => {
  // TAKING ID FROM ROUTE
  const { id } = req.query;
  // console.log({ id });
  // TAKING SESSION
  const session = (await getSession({ req })) as {
    profile: { id: string };
    userId: string;
  };
  // console.log({ session });
  // CHECKING profile
  if (id !== session.profile.id) {
    return res.status(401).send("UNAUTHORIZED");
  }

  // @ts-ignore
  if (session.profile.role !== "ADMIN") {
    return res.status(401).send("UNAUTHORIZED");
  }

  // OBTAINING USER
  const user = await prismaClient.user.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      id: true,
    },
  });
  //

  console.log({ user });

  // IF THERE IS NO USER

  if (!user || !user.id) {
    return res.status(401).send("UNAUTHORIZED");
  }

  next();
};

export default verifyCurrentUser;
