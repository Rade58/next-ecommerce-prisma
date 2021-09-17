/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { Order, Profile, OrderElement } from "@prisma/client";
import { useRouter } from "next/router";
import prismaClient from "../../lib/prisma";

import Layout from "../../components/8_order_page/Layout";

interface PropsI {
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

  return (
    <Layout>
      <div>
        <h1>Order ID: {query.orderId}</h1>
        <div>
          <pre>{JSON.stringify(props, null, 2)}</pre>
        </div>
      </div>
    </Layout>
  );
};

export default OrderPage;
