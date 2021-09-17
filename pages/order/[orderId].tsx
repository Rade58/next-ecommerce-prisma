/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import prismaClient from "../../lib/prisma";

import { useRouter } from "next/router";

interface PropsI {
  placeholder: boolean;
}

type paramsType = {
  orderId: string;
};

export const getServerSideProps: GetServerSideProps<PropsI, paramsType> =
  async (ctx) => {
    const { params } = ctx;

    const orderId = params?.orderId || "";

    const order = prismaClient.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        buyer: true,
        items: true,
      },
    });

    return {
      props: {
        placeholder: true,
      },
    };
  };

const OrderPage: NP<PropsI> = (props) => {
  //

  const { query } = useRouter();

  console.log(props);

  return (
    <div>
      <h1>Order ID: {query.orderId}</h1>
    </div>
  );
};

export default OrderPage;
