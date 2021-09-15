/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import Router from "next/router";

import { useActor } from "@xstate/react";

import { getSession, useSession } from "next-auth/client";

import { cartService } from "../machines/cart-machine";

import Layout from "../components/5_shipping_page/Layout";

interface PropsI {
  placeholder?: boolean;
}

/* type paramsType = {
  siteId: string;
}; */

export const getServerSideProps: GetServerSideProps<
  PropsI | { nothing: true } /* , paramsType */
> = async (ctx) => {
  const session = await getSession({
    req: ctx.req,
  });

  console.log({ session });

  // BECAUSE WE WILL CHECK STATE WE WILL DO FRONT END NAVIGATION
  // THAT IS WHY I DID COMMENT THIS OUT
  if (!session) {
    ctx.res.writeHead(302, { Location: "/signin/" });

    Router.push("/signin");

    return {
      props: {
        nothing: true,
      },
    };
  }

  // const { params } = ctx;

  // params?.siteId

  return {
    props: {
      placeholder: true,
    },
  };
};

const ShippingPage: NP<PropsI> = (props) => {
  //

  const [cartState, cartDispatch] = useActor(cartService);

  const [session, loading] = useSession();

  console.log(props);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!session) {
    Router.push("/signin");

    return null;
  }

  // HANDLING EMPTY CART

  if (!Object.keys(cartState.context.cart).length) {
    Router.push("/");

    return null;
  }

  return <Layout>{/* Shipping */}</Layout>;
};

export default ShippingPage;
