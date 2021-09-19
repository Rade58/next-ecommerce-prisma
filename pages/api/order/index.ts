import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

import prismaClient from "../../../lib/prisma";

import type { BodyDataI } from "../../../components/7_place_order_page/SummaryList";

const handler = nc<NextApiRequest, NextApiResponse>();

// CREATING ORDER
handler.post(async (req, res) => {
  const body = req.body;

  console.log({ body });

  const { buyerId, cart, shippingPrice, taxPrice, paymentMethod } =
    body as BodyDataI;

  if (!buyerId || !cart || !shippingPrice || !taxPrice || !paymentMethod) {
    return res.status(400).send("invalid body");
  }

  try {
    // AGAIN WE NEED TO CALCULATE AND WE WILL STORE TOTAL PRICE ON
    // ORDER OBJECT

    const cartArr = [];

    let total: number = 0;

    total = total + shippingPrice;

    for (const key in cart) {
      if (typeof key === "string") {
        cartArr.push(cart[key]);

        total =
          total +
          cart[key].price * cart[key].amount +
          (taxPrice / (100 / cart[key].price)) * cart[key].amount;
      }
    }

    // FIRST WE WILL CREATE ORDER
    const order = await prismaClient.order.create({
      data: {
        buyer: {
          connect: {
            id: buyerId,
          },
        },
        taxPrice,
        shippingPrice,
        totalPrice: parseFloat(total.toFixed(2)),
        paymentMethod,
      },
    });

    // ORDER ELEMENTS
    // THEY ARE TIEING IN INFO ABOUT PRODUCT AND QUANTITY

    // WE WILL CREATE ORDER ELEMENTS AND CONNECT THEM TO THE ORDER

    for (let item of cartArr) {
      await prismaClient.orderElement.create({
        data: {
          quantity: item.amount,
          productId: item.productId,
          orderId: order.id,
        },
        select: {
          id: true,
        },
      });
    }

    return res.status(201).send(order);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
});

export default handler;
