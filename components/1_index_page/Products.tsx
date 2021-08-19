/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { Grid } from "@material-ui/core";

import type { ProductsListType } from "../../dummy/products";

import ProductCard from "./ProductCard";

const LatestProducts: FC<{
  products: ProductsListType;
}> = ({ products }) => {
  return (
    <div
      css={css`
        margin: 10px auto;
        width: fit fit-content;
        border: pink solid 1px;
      `}
    >
      <Grid
        //
        container
        spacing={2}
        sm={12}
        md={6}
        lg={4}
        xl={3}
      >
        {products.map((product) => {
          return (
            <ProductCard
              product={product}
              key={`${product.productId}-${product.name}`}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default LatestProducts;
