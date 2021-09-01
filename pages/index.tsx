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

interface PagePropsI {
  products: Product[];
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
