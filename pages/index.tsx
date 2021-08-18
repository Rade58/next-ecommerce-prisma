/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { NextPage as NP } from "next";

import Lorem from "../components/Lorem";

import Layout from "../components/1_index_page/Layout";

const IndexPage: NP = () => {
  return (
    <>
      <Layout>{/* you can add extra content */}</Layout>
      <Lorem />
    </>
  );
};

export default IndexPage;
