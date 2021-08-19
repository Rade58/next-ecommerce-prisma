/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import type { ProductType } from "../../dummy/products";

const ProductLayout: FC<{
  product: ProductType;
}> = ({ product, children }) => {
  return (
    <main className="product-main">{JSON.stringify(product, null, 2)}</main>
  );
};

export default ProductLayout;
