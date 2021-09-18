/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useState } from "react";
import { Order, Profile, OrderElement } from "@prisma/client";
import { useRouter } from "next/router";

import Cookies from "js-cookie";

import Router from "next/router";
import { SHIPPING_DATA } from "../../components/5_shipping_page/ShippingForm";

import { PAYMENT_METHOD } from "../../components/6_payment_page/PaymentForm";

import prismaClient from "../../lib/prisma";

import Layout from "../../components/8_order_page/Layout";

export interface PropsI {
  order: Order & {
    buyer: Profile;
    items: OrderElement[];
  };
}

type paramsType = {
  orderId: string;
};

export const getServerSideProps: GetServerSideProps<
  PropsI | { ok: boolean },
  paramsType
> = async (ctx) => {
  const { params } = ctx;

  const orderId = params?.orderId || "";

  const cookies = ctx.req.cookies;

  console.log({ cookies });

  const order = await prismaClient.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      buyer: true,
      items: true,
    },
  });

  if (!order) {
    ctx.res.writeHead(302, { Location: "/" });

    return {
      props: {
        ok: false,
      },
    };
  }

  return {
    props: {
      order,
      ok: true,
    },
  };
};

const OrderPage: NP<PropsI> = (props) => {
  //

  const { query } = useRouter();

  console.log(props);

  const shippingData = Cookies.get(SHIPPING_DATA);
  const paymentMethod = Cookies.get(PAYMENT_METHOD);

  if (!shippingData) {
    Router.push("/shipping");

    return null;
  }
  if (!paymentMethod) {
    Router.push("/payment");

    return null;
  }

  return (
    <Layout order={props.order}>
      <div>
        <h1 style={{ fontSize: "2em" }}>Order ID: {query.orderId}</h1>
        {/* <div>
          <pre>{JSON.stringify(props, null, 2)}</pre>
        </div> */}
      </div>
    </Layout>
  );
};

export default OrderPage;
