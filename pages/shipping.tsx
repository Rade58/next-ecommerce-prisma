/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import { useEffect } from "react";

import Router from "next/router";

import { useActor } from "@xstate/react";

import { getSession, useSession } from "next-auth/client";

import type { Profile } from "@prisma/client";

import Cookies from "js-cookie";

import { SHIPPING_DATA } from "../components/5_shipping_page/ShippingForm";

import prismaClient from "../lib/prisma";

import { cartService } from "../machines/cart-machine";

import Layout from "../components/5_shipping_page/Layout";

interface PropsI {
  placeholder?: boolean;
  userData: {
    fullName: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
  };
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

  // WE NEED TO QUERY FOR PROFILE (AND USER)
  // WE ALREDY HAVE PROFILE (WE ATTACHED IT TO SESSION)

  const profile = session.profile as Profile;
  // WE JUST NEED TO FIND USER NAME (WHICH IS ON User RECORD)

  const user = await prismaClient.user.findFirst({
    where: {
      profiles: {
        some: {
          id: {
            equals: profile.id,
          },
        },
      },
    },
    select: {
      name: true,
    },
  });

  if (!user) {
    ctx.res.writeHead(302, { Location: "/signin/" });

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
      userData: {
        fullName: user.name,
        address: profile.addrss,
        city: profile.city,
        country: profile.country,
        postalCode: profile.postalCode,
      },
    },
  };
};

const ShippingPage: NP<PropsI> = (props) => {
  //

  const [cartState, cartDispatch] = useActor(cartService);

  const [session, loading] = useSession();

  console.log(props);

  useEffect(() => {
    if (!Object.keys(cartState.context.cart).length) {
      Router.push("/");
    }
  }, [cartState]);
  ``;
  if (loading) {
    return <div>loading...</div>;
  }

  if (!session) {
    Router.push("/signin");

    return null;
  }

  // HANDLING EMPTY CART

  // THIS CAUSES INFINITE LOOP
  /* const shippingData = Cookies.get(SHIPPING_DATA);

  if (!shippingData) {
    Router.push("/shipping");

    return null;
  }
 */
  const { userData } = props;

  return <Layout userData={userData}>{/* Shipping */}</Layout>;
};

export default ShippingPage;
