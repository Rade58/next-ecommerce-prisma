/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP, GetStaticProps } from "next";

import Lorem from "../components/Lorem";

import Layout from "../components/1_index_page/Layout";

import products from "../dummy/products";
import type { ProductsListType } from "../dummy/products";

interface PagePropsI {
  products: ProductsListType;
}

export const getStaticProps: GetStaticProps<PagePropsI> = async (ctx) => {
  // FETCHING FOR ALL POSTS
  // THIS IS DUMMY DATA THAT REPRESENTS FETCHING
  const prods = products;

  return {
    props: {
      products: prods,
    },
    revalidate: 1,
  };
};

const IndexPage: NP<PagePropsI> = ({ products }) => {
  return (
    <>
      <Layout products={products}>
        {/* you can add extra content (but i don;t need it so far) */}
      </Layout>
      <Lorem />
    </>
  );
};

export default IndexPage;
