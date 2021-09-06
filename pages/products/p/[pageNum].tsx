/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import prismaClient from "../../../lib/prisma";

import Layout from "../../../components/1_2_prod_pagination/Layout";

interface PropsI {
  products: string[];
}

type paramsType = {
  pageNum: string;
};

export const getServerSideProps: GetServerSideProps<
  PropsI | any[],
  paramsType
> = async (ctx) => {
  const { params } = ctx;

  const pageNum = params?.pageNum; //

  if (!pageNum) {
    return {
      props: {
        products: [],
      },
    };
  }

  if (typeof parseInt(pageNum) !== "number") {
    return {
      props: {
        products: [],
      },
    };
  }

  const cursorNumber = parseInt(pageNum);

  /* const cursor = prismaClient.product.findUnique({

    }) */

  return {
    props: {
      products: [],
    },
  };
};

const ProductPage: NP<PropsI> = (props) => {
  //

  console.log(props);

  return (
    <>
      <Layout>{/*  */}</Layout>
    </>
  );
};

export default ProductPage;
