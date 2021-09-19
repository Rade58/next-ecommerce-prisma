/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import type { Products as ProductsType } from "../../pages/index";

import Products from "./Products";

// import type { ProductsListType } from "../../dummy/products";

const Layout: FC<{
  products: ProductsType;
}> = ({ children, products }) => {
  return (
    <main
      className="products-pagination-page-content"
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

      <Products products={products} />
    </main>
  );
};

export default Layout;
