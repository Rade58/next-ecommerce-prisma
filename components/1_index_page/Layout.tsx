/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import LatestProducts from "./LatestProducts";

import products from "../../dummy/products";

const Layout: FC = ({ children }) => {
  return (
    <main
      className="index-page-content"
      css={css`
        border: pink solid 2px;
        padding: 10px auto;
      `}
    >
      {children}

      <LatestProducts products={products} />
    </main>
  );
};

export default Layout;
