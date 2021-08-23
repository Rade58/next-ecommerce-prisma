import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prismaClient from "../../../lib/prisma";

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      Providers.Email({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.FROM_EMAIL,
      }),
    ],

    database: process.env.DATABASE_URL,
    secret: process.env.SECRET,
    adapter: PrismaAdapter(prismaClient),

    /* session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    jwt: {
      secret: "VD01eYRMrJ5EG3EOJ8HjO9lgqmp4U8n7ro8pGq3838s",
      encryption: true,
    },

    debug: true, */

    // -------- I ADDED THIS --------
    // I SPECIFIED THE NEW LOGIN PAGE
    // AND PAGE WITH INFO THAT USER NEEDS TO CHECK HIS EMAIL
    pages: {
      signIn: "/signin",
      verifyRequest: "/veryify-email-info",
      // YOU CAN SET UP SOME MORE PAGES
      // CHACK THAT OUT IN SPARE TIME
    },
  });

export default handler;
