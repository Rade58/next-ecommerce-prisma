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
