# WE DON'T WANT TO USE `/api/auth/signin` AS OUR SIGNIN PAGE, WE WANT CUSTOM PAGE

**ALSO WE WILL CREATE CUSTOM "verify email page"**(A PAGE WHERE USER IS REDDIRECTED AFTER SUBMITING EMAIL)

MAYBE LATER I'LL ADD CUSTOM ERROR PAGE

BUT FOR NOW, BEFORE WE MADE ACTUAL PAGE LETS SPECIFY OUR CUSTOM SIGNIN PAGE IN OUR NEXT-AUTH CONFIGURATION

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

```

# LET'S NOW BUILD PAGES WE SPECIFIED

```
code pages/signin.tsx
```

```tsx

```


#

Check your email
A sign in link has been sent to your email address.


# REMANDER

USE EVENTS IN NEXT-AUTH TO CREATE Profile RECORD

USE SESSION CALLBACK TO INSERT PROFILE INTO SESSION

