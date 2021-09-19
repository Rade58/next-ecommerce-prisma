# PAYPAL

## FIRST WE WILL BUILD ROUTE FOR UPDTING ORDER

WE ARE GOING TO UPDATE ORDER WHEN WE GET BACK "PAYMENT OBJECT FROM PAYPAL"

**WHEN WE GET THAT OBJECT WE WILL CREATE `PaymentResult` RECORD**

**AND WE WILL THAN UPDATE RELATED `Order` RECORD**

THIS IS ROUTE FOR NOW:

```
cat pages/api/order/pay/[orderId].ts
```

```ts
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../../lib/prisma";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { orderId: id } = req.query;

  if (!id) {
    return res.status(400).send("order id invalid");
  }

  try {
    // LETS GET THE ORDER, AND WE WILL GET USERS EMAIL
    const order = await prismaClient.order.findUnique({
      where: {
        id: id as string,
      },
      include: {
        buyer: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    // IF ORDER DOESN'T EXIST

    if (!order) {
      return res.status(400).send("order not exist");
    }

    // I WON'T DO THIS NOW, BUT FOR SECURITY REASONS WE WOULD
    // CHECK SESSION AND CHECK BUYER (TO SECURE THIS
    // I AM SAVING ON TIME AND I AM NOT GOING TO DO THIS NOW)


    // NOW WE WOULD TALK TO PAYPAL API
    // TODO

    // --------------------------------

    // TODO
    // WHEN WE GET OBJECT FROM PAYPAL
    // WE CRATE PaymntResult OBJECT

    // TODO
    // WE THEN UPDATE ORDER BY CONNECTING
    // PAYMENT RECORD TO THE ORDER RECORD

    return res.status(201).send("some data");
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
```

WE ARE NOT DONE WITH UPPER ROUTE, WE WILL CONTINUE LATER, AFTER WE IMPLEMENT PAYPAL

# SETTING UP PAYPAL

I OPENED PERSONAL PAYPAL ACCOUNT

NOW I AM SIGNED IN AND I AM HERE:

<https://developer.paypal.com/developer/applications>

SELECT `Sandbox`, AND CREATE SOME FAKE ACCOUNTS (**LEFT MENU: Sandbox --> Accounts**)

**WE NEED SOME `PERSONAL ACCOUT/S` WHEN WE WANT TO PLAY CUSTOMER ROLE, WHEN WE WNT TO ENTER CREDIT CARD INFO WHEN TESTING OUR APP**

**AND WE NEED `BUSSINESS` ACCOUNT TO RECEIVE PAYMENTS** (ACCOUNT THAT WE GET PAID TO)

CREATE ONE PERSONAL AND ONE PRIVATE ACCOUNT (YOU ALREDY HAVE TWO DEFAULT ONE, BUT WE WILL CREATE NEW ONES FOR NO SPECIFIC REASON)

## GO BACK TO `My Apps And Credentials`

MAKE SURE THAT `Sandbox` IS CHECKED (OTHER OPTION IS `Live` (WHICH YOU WILL USE IN PRODUCTION))

AND CLICK ON `Create App`

NOW WE ARE CREATING APP, WE JUST NEED TO ENTER NAME, AND PICK ONE OF SANDBOX BUSINESS ACCOUNTS

## WE HAVE CREATED NEW APP AND WE GOT CLIENT ID, FROM THAT

WE'VE GOT SECRET TOO (BUT  WE ARE NOT GOING TO USE SECRET)

WE ARE GOING TO SET API CLIENT ID AS ENV VARIABLES IN OUR PROJECT

```
code .env.local
```

```PY
#  ...
# we wil ladd this at the end -->

PAYPAL_CLIENT_ID=

```

## WE ARE GOING TO CREATE CONFIG ROUTE FOR OUR PAYPAL

```
mkdir pages/api/config && touch pages/api/config/paypal.ts
```

```ts
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  // WE ARE JUST SENDING PAYPAL CLIENT ID BACK

  // BUT LET'S SECURE THIS
  // LETS CHECK FOR SESSION
  const session = await getSession({
    req: req,
  });

  console.log({ session });

  if (!session) {
    return res.status(401).send("NOT AUTHENTICATED");
  }

  return res.status(200).send(process.env.PAYPAL_CLIENT_ID);
});

export default handler;
```

SO,  WHEN WE ARE REDY TO MAKE PAYMENT WE WILL HIT THIS ROUTE

## BUT WE ALSO NEED A PAYPAL SCRIPT ON FRONTED

I FOUND THIS:

<https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-configuration/>

YOU HAVE HERE SCRIPT WE CAN USE

**BUT I DECIDED TO GO WITH PROVIDER SOLUTION, ALSO SPECIFIED ON UPPER PAGE**

AND IN THIS TUTORIAL, EVERYTHING IS EXPLAINED IN DETAIL

<https://www.youtube.com/watch?v=3kYkEVIZNZY>

## WE ARE GOING TO USE PACKAGE `react-paypal-js`

[____](https://www.npmjs.com/package/@paypal/react-paypal-js)

```
yarn add @paypal/react-paypal-js
```

## WE ARE GOING TO USE `@paypal/react-paypal-js` IN OUR `_app.tsx` PAGE


```
code pages/_app.tsx
```

```tsx
import { useEffect, Fragment } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { useRouter } from "next/router";

import { ThemeProvider, CssBaseline } from "@material-ui/core";

import { Provider } from "next-auth/client";

// LETS IMPORT THIS
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
//

import theme from "../theme";

import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();

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
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          {/* WE ARE GOING TO WRAP PAGE COMPONENT IN
          MENTIONED PROVIDER LIKE THIS, AND WE NEED 
          TO LOAD PAYPAL CLIENT ID FROM ENVIROMENT */}
          <PayPalScriptProvider
            options={{
              "client-id": process.env.PAYPAL_CLIENT_ID as string,
            }}
          >
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
export default MyApp;
```

ESENTIALLY WE ARE GOING TO TALK WITH REDUCER FUNCTION, WHISH IS IMPLEMENTED BY UPPER PROVIDER

## LETS WRITE UTILITY FUNCTION, WE ARE GOING TO USE EVERY TIME WE TALK TO PAYPAL, IT'S A FUNCTION THAT IS GOING TO HIT OUR ROUTE WE BUILD EARLIER, WAND WHICH IS SENDING PAYPAL API CLIENT, AND WE ARE GOING TO LOAD PAYPAL SCRIPT

WE ARE GOING TO WRITE A HOOK THAT WILL GIVE US MENTIONED FUNCTION

```
mkdir hooks/paypal && touch hooks/paypal/useLoadPaypalScript.tsx
```


