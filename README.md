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

