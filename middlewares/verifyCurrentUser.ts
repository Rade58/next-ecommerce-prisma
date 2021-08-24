import nc from "next-connect";
import type { Middleware } from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const verifyCurrentUser: Middleware<NextApiRequest, NextApiResponse> = async (
  req,
  res,
  next
) => {
  // VERIFY CURRENT USER

  console.log("HELLO USER");

  next("UNAUTHORIZED");
};

export default verifyCurrentUser;
