/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";

import prismaClient from "../../../lib/prisma";

import Layout from "../../../components/1_2_prod_pagination/Layout";

export type ProductI = {
  productId: string;
  adminId: string;
  name: string;
  image: string;
  description: string;
  brand: string;
  category: string | null;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
};

interface PropsI {
  products: ProductI[];
}

type paramsType = {
  pageNum: string;
};

export const getServerSideProps: GetServerSideProps<
  PropsI | any[],
  paramsType
> = async (ctx) => {
  // LETS FIRST CREATE SKIP VALUE
  // THAT WILL BE THE NUMBER OF PRODUCTS DISPLAYED ON THE PAGE
  const numOfProductsPerPage = 10;
  //
  //

  const { params, res } = ctx;

  // AND THIS NUMBER (QUERY PARMAETER) WILL BE NUMBER WE MULTIPPLY OUR
  // numOfProductsPerPage
  const pageNum = params?.pageNum; //

  if (!pageNum) {
    res.writeHead(302, { Location: "/" });
    return {
      props: {
        products: [],
      },
    };
  }
  if (typeof parseInt(pageNum) !== "number") {
    res.writeHead(302, { Location: "/" });
    return {
      props: {
        products: [],
      },
    };
  }
  if (!(parseInt(pageNum) % parseFloat(pageNum))) {
    res.writeHead(302, { Location: "/" });
    return {
      props: {
        products: [],
      },
    };
  }
  if (parseInt(pageNum) === 0) {
    res.writeHead(302, { Location: "/" });
    return {
      props: {
        products: [],
      },
    };
  }

  // ---------------- skip value ----------------
  const pageNumVal = parseInt(pageNum);

  const skipVal = numOfProductsPerPage * (pageNumVal - 1);

  const products = await prismaClient.product.findMany({
    take: pageNumVal,
    skip: skipVal,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      productId: true,
      adminId: true,
      name: true,
      image: true,
      description: true,
      brand: true,
      category: true,
      price: true,
      countInStock: true,
      rating: true,
      numReviews: true,
      /* createdAt: true,
      updatedAt: true, */
    },
  });
  // --------------------------------------------

  return {
    props: {
      products,
    },
  };
};

const ProductPage: NP<PropsI> = (props) => {
  //

  console.log(props);

  return (
    <>
      <Layout products={props.products}>{/*  */}</Layout>
    </>
  );
};

export default ProductPage;
