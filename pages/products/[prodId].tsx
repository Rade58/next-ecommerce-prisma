/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetStaticPaths, GetStaticProps, NextPage as NP } from "next";
import { useRouter } from "next/router";

import type { ProductType } from "../../dummy/products";
import products from "../../dummy/products";

interface ProductPageProps {
  product: ProductType;
}

type paramsType = { siteId: string };

export const getStaticPaths: GetStaticPaths<paramsType> = async (ctx) => {
  const prods = products;

  const paths = prods.map(({ productId }) => {
    return {
      params: {
        siteId: `${productId}`,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps, paramsType> =
  async (ctx) => {
    const siteId = ctx.params?.siteId;

    const [product] = products.filter(
      ({ productId }) => `${productId}` === siteId
    );

    return {
      props: {
        product,
      },
      revalidate: 1,
    };
  };

const FeedbackPage: NP<ProductPageProps> = ({ product }) => {
  console.log({ product });

  const { query } = useRouter();

  console.log({ query, product });

  return <div>Page ID: {query.prodId}</div>;
};

export default FeedbackPage;
