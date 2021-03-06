/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP, GetStaticProps } from "next";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/client";

import type { Product } from "@prisma/client";

import { useRouter } from "next/router";

import { useActor } from "@xstate/react";

import {
  shippingNavService,
  EE as EEE,
  fse as fsee,
} from "../machines/shipping-nav-machine";

import prismaClient from "../lib/prisma";

// import Lorem from "../components/Lorem";

import Layout from "../components/1_index_page/Layout";

import CookieStore from "../lib/cart-cookies";

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
          // rating: "desc",
          updatedAt: "desc",
        },
        take: 8,
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

      console.log({ products });

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

  const { push, asPath } = useRouter();

  console.log({ session, loading });

  const [stateSh, dispatchSh] = useActor(shippingNavService);

  const [intention, setIntention] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (intention) return;

    // console.log(asPath);

    // if (asPath.includes("/veryify-email-info")) return;

    const a = CookieStore.checkShippingNavIntent();

    if (a) {
      setIntention("hello world");
      CookieStore.deleteShippIntent();
      push("/shipping");
    }
  }, [push, intention, setIntention]);

  const shipIntent = CookieStore.checkShippingNavIntent();

  console.log({ shipIntent });

  if (shipIntent) {
    return null;
  }

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
