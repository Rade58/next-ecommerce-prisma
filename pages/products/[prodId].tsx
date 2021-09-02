/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useRouter } from "next/router";

import type { Product, Review } from "@prisma/client";

import prismaClient from "../../lib/prisma";

// import type { ProductType } from "../../dummy/products";
// import products from "../../dummy/products";

import ProductLayout from "../../components/2_product_page/Layout";

export interface ProductPageProps {
  product: {
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
    reviews: Review[];
  };
}

type paramsType = { prodId: string };

export const getServerSideProps: GetServerSideProps<
  ProductPageProps | { product: { nothing: true } },
  paramsType
> = async (ctx) => {
  const prodId = ctx.params?.prodId;

  if (!prodId) {
    return {
      props: {
        product: {
          nothing: true,
        },
      },
    };
  }

  try {
    const product = await prismaClient.product.findUnique({
      where: {
        productId: prodId,
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
        reviews: true, // LIST OF REVIEWS
      },
    });

    if (!product) {
      return {
        props: {
          product: {
            nothing: true,
          },
        },
      };
    }

    return {
      props: {
        product,
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        product: {
          nothing: true,
        },
      },
    };
  }
};

const ProductPage: NP<ProductPageProps> = ({ product }) => {
  // console.log({ product });

  const { query } = useRouter();

  // console.log({ query, product });

  return (
    <ProductLayout product={product}>{/* additional things */}</ProductLayout>
  );
};

export default ProductPage;
