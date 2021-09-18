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
mkdir -p pages/api/config/paypal
```