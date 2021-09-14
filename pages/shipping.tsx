/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import { getSession } from "next-auth/client";

interface PropsI {
  placeholder: boolean;
}

type paramsType = {
  siteId: string;
};

export const getServerSideProps: GetServerSideProps<PropsI, paramsType> =
  async (ctx) => {
    const session = await getSession({
      req: ctx.req,
    });

    console.log({ session });

    if (!session) {
      ctx.res.writeHead(302, { Location: "/signin" });
    }

    const { params } = ctx;

    params?.siteId; //

    return {
      props: {
        placeholder: true,
      },
    };
  };

const ShippingPage: NP<PropsI> = (props) => {
  //

  console.log(props);

  return <div>🦉</div>;
};

export default ShippingPage;
