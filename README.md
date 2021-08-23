# CREATING Profile RECORD ON `createUser` EVENT OF NEXT-AUTH

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

    // DEFINING createUser EVENT HANDLER
    events: {
      createUser: async (user) => {
        if (!user.email) return;

        // GOING TO USE prismaClient
        // TO CREATE NEW Profile RECORD
        // IN OUR DATBASE

        // FIRST LET'S GET USER BY HIS email
        const obtainedUser = await prismaClient.user.findUnique({
          where: {
            email: user.email,
          },
          select: {
            // I MADE THIS QUERY BECAUSE I WANTED
            // TO OBTAIN ID FROM THE USER OBJECT
            // BECAUSE ON user ARGUMENT OF EVENT HANDLER
            //  LOOKS LIKE THERE IS NO ID
            id: true,
          },
        });

        if (!obtainedUser) return;

        // NOW LETS CREATE PROFILE OBJECT

        await prismaClient.profile.create({
          data: {
            // MAKING CONNECTION WITH A USER BY USING ID
            // BECAUSE FOREIGN KEY THAT IS COMMING FROM User
            // IS id
            user: {
              connect: {
                id: obtainedUser.id,
              },
            },
            // WE CAN ADD SOME OTHER FIELDS
            // BUT WE DON'T NEED TO ADD IN EVERY COLUMN BECAUSE
            // A LOT OF FIELDS ARE OPTIONAL
            // AND WE WILL UPDATE Profile RECORD
            // WHEN WE START ADDING LOGIC FOR USER TO ADD PAYMENT METHODS AND STUFF
            // ON HIS PROFILE
          },
        });
      },
    },
  });

export default handler;
```


I TRYED SIGNING IN AND IN SEEMS TO WORK

AFTER SIGNING UP I SAW A NEW Profile RECORD INSIDE PRISMA STUDIO

YES GOOD IDEA IS TO HAVE OPENED PRISMA STUDIO WHILE DOING THIS KIND OF DEVELOPMENT (`yarn prisma:studio`)