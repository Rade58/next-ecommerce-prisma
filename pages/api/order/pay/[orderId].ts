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
