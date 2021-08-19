/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import LatestProducts from "./Products";

import products from "../../dummy/products";

const Layout: FC = ({ children }) => {
  return (
    <main
      className="index-page-content"
      css={css`
        border: pink solid 2px;
        margin: 12px 10%;
        position: relative;
        display: flex;
        justify-content: center;
      `}
    >
      {children}

      <LatestProducts products={products} />
    </main>
  );
};

export default Layout;
