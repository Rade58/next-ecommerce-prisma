# WE ARE GOING TO IMPLEMENT AUTHENTICATION WITH NEXT-AUTH

THIS IS A HELPFUL TUTORIAL, WE CAN EXTEND WITH OUR CUSTOM STUFF TO SERVE OUR NEEDS

<https://flaviocopes.com/nextjs-email-authentication/>

# WE FORGOT TO DEFINE PRISMA CLIENT

I DID THAT HERE: `lib/prisma/index.ts`

# NOW LET'S INSTALL PRISMA ADAPTER

```
yarn add @next-auth/prisma-adapter
```

# LET'S CREATE EMAIL PROVIDER ACCOUNT

I AM GOING TO USE <https://mailtrap.io/>

THIS IS A EMAAIL PROVIDER MADE SPECIFICALLY FOR TESTING AND DEVELOPMENT

# SETTING UP ENV

```
code .env.local
```

```py
DATABASE_URL=

# ADDED THIS
# FROM MAILTRAP
EMAIL_SERVER=smtp://user:pass@smtp.mailtrap.io:465
# THIS YOU SET YOUR EMAIL
# I THINK YOU SHOUD USE GMAIL HERE (BUT MAKE SURE YOU DON'T HAVE
# TWO FACTOR ON THAT GMAIL)
# OR YOU CAN PUT WHATEVER MAIL DRESS HER (I'M NOT CERTAIN)
EMAIL_FROM=Your name <you@email.com>
# FOR DEV ONLY (YOU CHANGE THIS IN PRODUCTION)
NEXTAUTH_URL=http://localhost:3000
# SECRET OF YOUR CHICE
SECRET=
```

# MY NEHT AUTH ENDPOINT SETUP

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

# `_app.tsx`

```tsx
import { useEffect, Fragment } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { ThemeProvider, CssBaseline } from "@material-ui/core";

// IMPORTED PROVIDER
import { Provider } from "next-auth/client";

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
      {/* ADDED Provider */}
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