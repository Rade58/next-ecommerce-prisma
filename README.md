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

  // THIS BODY WOULD BE CONSTRUCTED FROM SOME DATA
  // WE WOULD TAKE AFTER PAYPAL CREATES HIS ORDER OBJECT
  // OR PAYMENT OBJECT, OR CALL IT WHAT EVER YOU WANT

  const body = req.body;

  if (!body) {
    return res.status(400).send("invalid body");
  }

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

    // --------------------------------

    // TODO
    // WE SHOULD CREATE PaymentResult RECORD

    // TODO
    // WE THEN UPDATE ORDER BY CONNECTING
    // PymentResult RECORD TO THE ORDER RECORD

    // WE NEED TO UPDATE SOME MORE TUFF ON OUR ORDER RECORD
    // FOR EXAMPLE IT SHOULD BE MARKED ASS PAYED (YOU'LL KNOW WHAT
    // TO CHANGE (LOOK INTO SCHEMA IF YOU DON'T KNO))

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
// import type { ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
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

  // THESE ARE SOME INITIAL OPTIONS FOR PROVIDER

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
              // I DON'T THINK WE SHOULD USE ID HERE LIKE
              // THIS SINCE WE WILL MAKE REQUEST TO OUR ENDPOINT TO
              // TAKE ID
              // "client-id": process.env.PAYPAL_CLIENT_ID as string,
              // I SAW THAT PEOPLE WRITE HERE "test"
              "client-id": "test",
            }}
            // AND WE WILL DEFER LOADING OF
            // PAYPAL SCRIPT
            deferLoading={true}
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

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
import React, { useCallback } from "react";
import type { FC } from "react";

import axios from "axios";

// THIS PACKAGE HAS A HOOK THAT WILL ALLOW US TO USE REDUCER
import {
  usePayPalScriptReducer,
  // AMONG OTHER THINGS IT ALSO HAS THIS PACKAGE THAT PROVIDE US
  // WITH A COMPONENTS FOR THE BUTTONS
  PayPalButtons,
  DISPATCH_ACTION,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";

const useLoadPaypalScript = () => {
  // LETS USE PAYPALS REDUCER
  // ON THIS OBJECT WE HAVE SOME HELPFUL BOOLEANS
  // WE ARE GOING TO USE JUST isPending
  const [options, paypalDispatch] = usePayPalScriptReducer();

  const { isPending } = options;

  // WE WILL CREATE ASYNC FUNCTION

  const loadPypalScript = useCallback(async () => {
    // FIRST WE HIT THE ROUTE

    // WE DON'T NEED TO SEN OUR SESSION
    // BECAUSE IT IS SENT WITH EVERY REQ SINCE ITS A PART OF COOKIE
    // HEADER, TLEAST I THINK IT IS

    // LIKE I SAID SESSION WILL BE IN THE COOKIE AND I
    // ALREDY DEFINED CHECKING FOR THAT SESSION, ON API ROUTE
    const { data: clientId } = await axios.get("/api/config/paypal");

    if (!clientId || typeof clientId !== "string") {
      throw new Error("paypal client id is invalid");
    }

    // NOW WE ARE DISPATCHING TO THE PAYPAL REDUCE
    // WE WANT TO SAY TO HIM THAT WE GOT CLIENT ID
    // AND THAT IT SHOUD USE OPTIONS WE WILL GIVE IT

    paypalDispatch({
      type: DISPATCH_ACTION.RESET_OPTIONS,
      value: {
        // WE CAN PASS ANY OPTIONS AND OVERWRITE THEM
        // WE DON'T HAVE ANY PREVIOUS OPTIONS
        // BUT WE ARE GOING TO DO SPREAD
        ...options,
        "client-id": clientId,
        // WE WILL SET UP CURRENCY TOO
        currency: "USD",
      },
    });

    // NOW WE ARE SETTING LOADING STATUS
    // BY DOING THIS WE ARE LOADING PAYPAL SCRIPT
    paypalDispatch({
      type: DISPATCH_ACTION.LOADING_STATUS,
      value: SCRIPT_LOADING_STATE.PENDING,
    });
  }, [options, paypalDispatch]);

  // WE WILL RETURN BOOLEAN SO WE CAN DISPLAY LOADER
  // WE CAN RETURN COMPONENT WE WILL DISPLAY
  // AND OFCOURSE, WE ARE GOING TO RETURN UPPER CALLBACK

  // DEPENDING ON IF SCRIPT IS LOADED OR NOT
  // isPending IS GOING TO CHANGE ODCOURSE

  return {
    isPending,
    PayPalButtons,
    loadPypalScript,
  };
};

export default useLoadPaypalScript;
```

**JUST TO TELL TO YOU IF YOU ARE CONFUSED ABOUT WHAT HAPPEND AFTER PAYING, OR IF A PAYING IS FAILED `PayPalButtons` COMPONENT ACCEPTS CALLBACS FOR THAT MATTER**

IN [THIS STORYBOOK](https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalbuttons--default) YOU CAN SEE ALL POSIBLE PROPS FOR THE `PayPalButtons` COMPONENT

WE ARE GOING TO BE INTERESTED IN `createOrder`, `onApprove`, `onError`

## WE CAN NOW USE THIS HOOK

WE ARE GOING TO BUILD PAYPAL COMPONENT

```
touch components/8_order_page/PayPalStuff.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useEffect } from "react";

import { CircularProgress } from "@material-ui/core";

import Router from "next/router";

// WE CAN IMPORT THE HOOK
import useLoadPaypalScript from "../../hooks/paypal/useLoadPaypalScript";
import axios from "axios";

interface PropsI {
  orderPayed: boolean;
  orderId: string;
  amountToBePayed: number;
}

const PayPalStuff: FC<PropsI> = ({ orderPayed, amountToBePayed, orderId }) => {
  console.log({ orderPayed, amountToBePayed, orderId });

  const { PayPalButtons, isPending, loadPypalScript } = useLoadPaypalScript();

  // INSIDE EFFECT WE WILL LOAD PAYPAL SCRIP
  // BUT ONLY IF ORDER ISN'T PAYED FOR

  
  const [canLoad, setCanLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!canLoad) return;

    if (!orderPayed) {
      loadPypalScript();
      setCanLoad(false);
    }
  }, [orderPayed, loadPypalScript, setCanLoad, canLoad]);

  return (
    <Fragment>
      {!orderPayed && (
        <div className="paypal-buttons">
          {!isPending ? (
            <PayPalButtons
              createOrder={async (__, actions) => {
                // HERE WE ARE GOING TO DEFINE HOW MUCH WE CHARGE THE
                // THE USERS CARD

                // WE ARE GOING TO USE
                // actions.order.create
                // THIS HAS NOTHING TO DO WITH OUR ORDER RECORD
                // IN OUR DATBASE

                // YOU CAN SAY THAT WE ARE TRYING TO CREATE ORDER
                // INSIDE PAYPLAS DATBASE

                const paypalOrderId = await actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: amountToBePayed.toFixed(2),
                        currency_code: "USD",
                      },
                    },
                  ],
                });

                // WE RETURN ID OF CREATED PAYPAL ORDER
                return paypalOrderId;
              }}
              onApprove={async (data, actions) => {
                // HERE WE SHOULD DFINE WHAT HAPPENS
                // AFTER PAYMENT WAS SUCCESSFULL
                // WE SHOUD DEFINE UPDATING OF OUR ORDER OBJECT
                // THAT'S AN ORDER OBJECT WE MADE EARLIER IN OUR DATBASE

                // AND WE SHOUD CREATE PaymentResult RECORD

                // OF COURSE WE DO THIS BY HITTING THE ROUTE
                // WE ALREADY MADE BUT WE NEED TO ALTER SOME CODE IN
                // MWNTIONED ROUTE

                // BUT WE MUST CALL capture HERE
                // BY DOING THIS WE ARE CONFIRMING PAYMENT
                // AND WE ARE GETTING SOME DATA IN RETURN
                // WE WILL GET BODY OF THE RESPONSE (I GUESS RESPONSE
                // THAT IS BEING SENT AFTER SUCCESSFULL PAYMENT)
                const details = await actions.order.capture();

                const {
                  id: paymentId,
                  status,
                  update_time,
                  payer: { email_address },
                } = details;

                // THIS status CAN HAVE THESE VALUES:
                // "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED"
                // IT MAKES SENSE WHY YOU WOULD SAVE THIS TO
                // YOUR DATABASE

                // NOW LETS SEND REQUEST TO OUR API ROUTE

                try {
                  // I AM SANDING "POST" REQUEST
                  // BECAUSE WE ARE GOING TO CREATE PaymentResult
                  // RECORD ALSO, BESIDES UPDATING Order RECORD

                  const { data: d } = await axios.post(
                    `/api/order/pay/${orderId}`,
                    { paymentId, status, update_time, email: email_address }
                  );
                  // WE DIDN'T SEND AUTHORIZATION HEADERS
                  // BECAUSEE WE HAVE (OR NOT) SESSION INSIDE COOKIE
                  // WE ARE GOING TO CHECK FOR SESSION AT BACKEND

                  // WE CAN REFRESH AFTER SUCCESSFUL REQUEST
                  // BUT WE ARE NOT GOING TO DO FULL REFRES
                  // JUST NAVIGATE TO THE SAME PAGE

                  // IDE IS TO CAUSE A PAGE REFRESH SO
                  // UPDATED ORDER CAN BE SEEN
                  Router.push(`/order/${orderId}`);

                } catch (error) {
                  console.error(error);

                  // WE SHOULD NAVIGATE MAYBE TO ERROR PAGE
                  // WE SHOULD BUILT IN CASE PAYPAL FAILS

                  // I AM JUST DOING THIS FOR US TO FINISH QUICKLY
                  // YOU CAN DECIDE ON YOUR OWN WHAT YOU WANT TO DO
                  // WITH ERROR

                  Router.push("/payment-error");
                }
              }}
              onError={(error) => {
                console.error(error);

                // SAME THING I AM DOING WITH THIS ERROR

                Router.push("/payment-error");
              }}
            />
          ) : (
            <CircularProgress size={20} color="primary" />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default PayPalStuff;
```

**AND WE WILL USE A COMPONENT, ON OUR ORDER PAGE** (WE HOOKED IT UP)

LIKE YOU SAW, IF ORDER IS ALREADY PAYED, WE ARE NOT GOING TO LOAD PAYPAL SCRIPT AND WE ARE NOT GOING TO SHOW ANYTHING RELATED TO PAYPAL IN THAT INSTANCE, aAND YOU CAN SEE BY LOOKING CODE ABOVE WHAT ROUTE WE ARE HITTING

## LETS CONTINUE DEFINING CODE OF OUR API ROUTE

```
code pages/api/order/pay/[orderId].ts
```

```tsx
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";

import prismaClient from "../../../../lib/prisma";
import { Profile } from ".prisma/client";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  const { orderId: id } = req.query;

  // LET'S CHECK IS USER SIGNED IN
  const session = await getSession({
    req,
  });

  // IF THERE IS NO USER LETS THROW
  if (!session) {
    return res.status(401).send("no signed in user");
  }

  // LETS TYPE BODY AND LETS CHECK IDF BODY IS VALID

  const body = req.body as {
    paymentId: string;
    status: "string";
    update_time: string;
    email: string;
  };

  if (!body) {
    return res.status(400).send("invalid body");
  }

  if (!body.paymentId) {
    return res.status(400).send("no payment id");
  }

  if (!id) {
    return res.status(400).send("order id invalid");
  }

  try {
    // LETS GET THE ORDER, AND WE WILL GET USERS EMAIL
    const order = await prismaClient.order.findUnique({
      where: {
        id: id as string,
      },
    });
    // IF ORDER DOESN'T EXIST

    if (!order) {
      return res.status(400).send("order not exist");
    }

    // LET'S CHECK IF USER OWNS THE ORDER

    if (order.buyerId !== (session.profile as Profile).id) {
      return res.status(401).send("User doesn't own order");
    }

    // --------------------------------
    // NOW WE HAVE BODY DATA, LET'S CREATE
    // PaymentResult RECORD

    const paymentResult = await prismaClient.paymentResult.create({
      data: {
        email: body.email,
        paymentId: body.paymentId,
        update_time: body.update_time,
        status: body.status,
        orders: {
          connect: {
            id: order.id,
          },
        },
      },
    });

    // LIKE YOU SEE ABOVE, WE DID CONNECT
    // PymentResult RECORD TO THE ORDER RECORD

    // WE NEED TO UPDATE SOME MORE TUFF ON OUR ORDER RECORD
    // FOR EXAMPLE IT SHOULD BE MARKED ASS PAYED (YOU'LL KNOW WHAT
    // TO CHANGE (LOOK INTO SCHEMA IF YOU DON'T KNO))

    // THIS IS MISTAKE I MADE BY ADDING THIS FIELDS
    // TO THE ORDER
    // IT SHOULD BE APARENT WHAT IS THE STATUS OF THE ORDER OR
    // IF AND WHEN IT WAS PAYED, ONLY BAY CHECKING PaymentResult RECORD
    const updatedOrder = await prismaClient.order.update({
      where: {
        id: order.id,
      },
      data: {
        payedAt: new Date(body.update_time),
        status: "FULFILLED",
      },
    });

    // LET'S SEND UPDATED ORDER
    return res.status(201).send(updatedOrder);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
```

## WE CAN TEST BY TRYING TO MAKE PURCHASE IN OUR APP

MAKE SURE YOU ARE LOGED IN YOUR PAYPAL ACCOUNT

I PLACE THE ORDER AND I CAN SEE PAYPAL BUTTONS ON THE SCREEN 

LET'S TRY PAYING

YOU WILL HAVE POP UP MENU, AND **MAKE SURE THAT YOU SEE `"sandbox"` IN THE URL OF THE POPUP, BECAUSE LIKE I SAID WE ARE JUST USING SANDBOX ACCOUNT BECAUE WE ARE DEVELOPING AND WE DDON'T WANT TO USE REAL MONEY, (OTHERVISE YOU WOULD SEE "live" IN URL, AND THAT IS NOT SANDBOX, THAT WOULD BE A REAL THING)** 

JUST IN CASE CHECK AN EMAIL OF YOUR SANDBOX ACCOUNT

SIGN IN TO PAYPAL GO TO


