/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import Router from "next/router";

import { getSession, useSession } from "next-auth/client";

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

  /* if (!session) {
    ctx.res.writeHead(302, { Location: "/signin" });

    Router.push("/signin");

    return {
      props: {
        nothing: true,
      },
    };
  }
 */
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

  const [session, loading] = useSession();

  console.log(props);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!session) {
    Router.push("/signin");

    return null;
  }

  return <div>Shipping</div>;
};

export default ShippingPage;
