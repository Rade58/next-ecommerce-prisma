/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import { getSession } from "next-auth/client";
import type { Profile } from "@prisma/client";

import Cookies from "js-cookie";

import Router from "next/router";
import { SHIPPING_DATA } from "../components/5_shipping_page/ShippingForm";

import Layout from "../components/7_place_order_page/Layout";

interface PropsI {
  placeholder: boolean;
}

export const getServerSideProps: GetServerSideProps<
  PropsI | { nothing: true }
> = async (ctx) => {
  const session = await getSession({
    req: ctx.req,
  });

  // console.log({ session });

  if (!session) {
    ctx.res.writeHead(302, { Location: "/signin/" });

    // Router.push("/signin");

    return {
      props: {
        nothing: true,
      },
    };
  }

  if (!session.profile) {
    ctx.res.writeHead(302, { Location: "/signin/" });

    return {
      props: {
        nothing: true,
      },
    };
  }

  if (!(session.profile as Profile).id) {
    ctx.res.writeHead(302, { Location: "/signin/" });

    return {
      props: {
        nothing: true,
      },
    };
  }

  const cookies = ctx.req.cookies;

  console.log({ cookies });

  return {
    props: {
      placeholder: true,
    },
  };
};

const PlaceOrderPage: NP<PropsI> = (props) => {
  //

  console.log(props);

  const shippingData = Cookies.get(SHIPPING_DATA);

  if (!shippingData) {
    Router.push("/shipping");

    return null;
  }

  return (
    <div>
      <Layout>{/*  */}</Layout>
    </div>
  );
};

export default PlaceOrderPage;
