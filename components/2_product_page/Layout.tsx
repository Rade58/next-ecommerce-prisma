/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { Button } from "@material-ui/core";

// import type { ProductType } from "../../dummy/products";

import type { ProductPageProps } from "../../pages/products/[prodId]";

import SingleProduct from "./Product";

const ProductLayout: FC<{
  product: ProductPageProps["product"];
}> = ({ product, children }) => {
  return (
    <main
      className="product-main"
      css={css`
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;

        margin: 2vh auto;

        @media screen and (min-width: 680px) {
          width: 60vw;
        }
      `}
    >
      <section
        css={css`
          /* border: pink solid 1px; */
        `}
      >
        <SingleProduct product={product} />
      </section>

      {children}
    </main>
  );
};

export default ProductLayout;
