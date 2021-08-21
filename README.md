# WE ARE GOING TO IMPLEMENT AUTHENTICATION WITH NEXT-AUTH; `AND WE AE GOING TO IMPLEMENT MAGIC LINK WITH EMAIL`

THIS IS A HELPFUL TUTORIAL, WE CAN EXTEND WITH OUR CUSTOM STUFF TO SERVE OUR NEEDS

<https://flaviocopes.com/nextjs-email-authentication/>

# WE FORGOT TO DEFINE PRISMA CLIENT

I DID THAT HERE: `lib/prisma/index.ts`

# NOW LET'S INSTALL PRISMA ADAPTER, BECAUSE WE NEED THAT TOO

```
yarn add @next-auth/prisma-adapter
```

# LET'S CREATE EMAIL PROVIDER ACCOUNT, JUST FOR TESTING AND DEVELOPMENT

I AM GOING TO USE <https://mailtrap.io/>

THIS IS A EMAIL PROVIDER MADE SPECIFICALLY FOR TESTING AND DEVELOPMENT

IT IS VERY HELPFUL

YOU CAN DEFINE MANY THINGS, YOU CAN DEBUG HTML OF YOUR EMAIL

**WITH MAILTRAP YOU HAVE BOTH, EMAIL SERVER, AND `YOU HAVE INBOX IN DASBOARD`**

**SO YOU DON'T NEED TO USE REAL EMAIL ACCOUNTS SINCE MAILTRAP IS DOING EVERYTHING NEEDED FOR TESTING AND DEVELOPMENT**

# SETTING UP ENV

```
code .env.local
```

```py
DATABASE_URL=

# ADDED THIS
# FROM MAILTRAP
# THIS IS IMPORTANT AND PRETTY EASY TO SETUP
# IN MAILTRAP DASBOARD, YOU CAN FIND USER AND PASS
EMAIL_SERVER=smtp://user:pass@smtp.mailtrap.io:465
# THIS YOU SET YOUR EMAIL
# YOU CAN MADE UP AN EMAIL
# IT DOESN'T NEED TO BE REAL EMAIL
# IT IS ONLY GOING TO BE DISPLAYD AS SENDER EMAIL
EMAIL_FROM=Your name <you@email.com>
# AS YOU KNOW
# THIS IS BASE URL FOR NEXT AUT FOR DEV ONLY 
# (YOU CHANGE THIS IN PRODUCTION, BY ADDING REAL DOMAIN)
NEXTAUTH_URL=http://localhost:3000
# AND A SECRET OF YOUR CHICE SECRET OF YOUR CHICE
SECRET=
```

# NEXT-AUTH ENDPOINT SETUP

```
mkdir -p pages/api/auth && touch "pages/api/auth/[...nextauth].ts"
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
```

# `_app.tsx` (WE NEED SESSION PROVIDER)

BECAUSE WE WANT TO USE `useSession` HOOK ACROSS OUR APP

```tsx
import { useEffect, Fragment } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { ThemeProvider, CssBaseline } from "@material-ui/core";

// IMPORT PROVIDER
import { Provider } from "next-auth/client";
// 

import theme from "../theme";

import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* USED Provider HERE */}
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
export default MyApp;

```

# ADDING A LINK INSIDE OUR APP THAT POINTS TO THE `/api/auth/signin`