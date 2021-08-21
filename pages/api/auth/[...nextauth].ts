import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prismaClient from "../../../lib/prisma";

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMIL_FROM,
      }),
    ],

    database: process.env.DATABASE_URL,
    secret: process.env.SECRET,

    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    jwt: {
      secret: "VD01eYRMrJ5EG3EOJ8HjO9lgqmp4U8n7ro8pGq3838s",
      encryption: true,
    },

    debug: true,
    adapter: PrismaAdapter(prismaClient),
  });

export default handler;
