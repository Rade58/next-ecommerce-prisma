# WE CAN QUERY FOR PROFILE AND INCLUDE PROFILE INSIDE SESSION OBJECT

WE WILL DEFINE `session` CALLBACK IN OUR NEXT-AUTH CONFIGURATION

```
code pages/api/auth/[...nextauth].ts
```

```ts
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

    pages: {
      signIn: "/signin",
      verifyRequest: "/veryify-email-info",
    },

    events: {
      createUser: async (user) => {
        if (!user.email) return;

        const obtainedUser = await prismaClient.user.findUnique({
          where: {
            email: user.email,
          },
          select: {
            id: true,
          },
        });

        if (!obtainedUser) return;

        await prismaClient.profile.create({
          data: {
            user: {
              connect: {
                id: obtainedUser.id,
              },
            },
          },
        });
      },
    },

    // OK WE WILL DEFINE ONE CALLBACK
    // I'M GOING TO ADD session CALLBACK

    callbacks: {
      session: async (session, user) => {
        // WE WILL QUERY FOR PROFILE, BUT NOT JUST FOR PROFILE
        // WE WILL EMBED INSIDE SESSION MORE THINGS
        // MAYBE USER ID
        // USER ID SHOULD BE ON user PARAMETER

        if (session.userId && session.profile) {
          return session;
        }

        const userId = user.id as string;

        if (userId) {
          session.userId = userId;
        }

        // QUERY FOR PROFILE
        const profile = await prismaClient.profile.findFirst({
          where: {
            user: {
              id: {
                equals: userId,
              },
            },
          },
          // IF WE DON'T SELECT ANY SPECIFIC FIELDS
          // WHOLE RECORD WILL BE PROVIDED, WITH EVERY FIELD
          /* select: {

          } */
        });

        if (profile) {
          session.profile = profile;
        }

        return session;
      },
    },
  });

export default handler;

```

## I TRYIED THIS AND IT WORKED

ON SESSION IS EVERYTHING I ADDED IN ADDITION

