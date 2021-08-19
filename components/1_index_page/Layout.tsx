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
        /* border: pink solid 2px; */
        margin: 0px auto;
        position: relative;
        display: flex;
        justify-content: center;

        @media screen and (min-width: 680px) {
          width: 80vw;
        }
      `}
    >
      {children}

      <LatestProducts products={products} />
    </main>
  );
};

export default Layout;
