/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP, GetStaticProps } from "next";

import { useSession } from "next-auth/client";

import type { Product } from "@prisma/client";

import prismaClient from "../lib/prisma";

import Lorem from "../components/Lorem";

import Layout from "../components/1_index_page/Layout";

// import products from "../dummy/products";
// import type { ProductsListType } from "../dummy/products";

export type Products = {
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
}[];

interface PagePropsI {
  products: Products;
}

export const getStaticProps: GetStaticProps<PagePropsI | { products: [] }> =
  async (ctx) => {
    // FETCHING FOR ALL POSTS
    // THIS IS DUMMY DATA THAT REPRESENTS FETCHING

    try {
      const products = await prismaClient.product.findMany({
        orderBy: {
          updatedAt: "asc",
        },
        take: 38,
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

      return {
        props: {
          products,
        },
        revalidate: 1,
      };
    } catch (err) {
      console.error(err);

      return {
        props: {
          products: [],
        },
      };
    }
  };

const IndexPage: NP<PagePropsI> = ({ products }) => {
  console.log({ products });

  const [session, loading] = useSession();

  console.log({ session, loading });

  return (
    <>
      <Layout products={products}>
        {/* you can add extra content (but i don;t need it so far) */}
      </Layout>
      {/* <Lorem /> */}
    </>
  );
};

export default IndexPage;
