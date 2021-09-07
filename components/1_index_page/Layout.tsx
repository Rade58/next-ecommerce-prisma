/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import type { Products as ProductsType } from "../../pages/index";

import LatestProducts from "./Products";
import Carousel from "./Carousel";
// import type { ProductsListType } from "../../dummy/products";

const Layout: FC<{
  products: ProductsType;
}> = ({ children, products }) => {
  return (
    <main>
      <div
        css={css`
          position: relative;
        `}
      >
        <Carousel />
      </div>
      <section
        className="index-page-content"
        css={css`
          /* border: pink solid 2px; */
          margin: 20px auto;
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        `}
      >
        {children}
        <LatestProducts products={products} />
      </section>
    </main>
  );
};

export default Layout;
