/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { Grid } from "@material-ui/core";

import type { ProductsListType } from "../../dummy/products";

const LatestProducts: FC<{
  products: ProductsListType;
}> = ({ products }) => {
  return (
    <Grid xs={12} sm={12} md={6} lg={4} xl={3}>
      {products.map(({ name, image, productId }) => {
        return <div key={`${productId}-${name}`}>{name}</div>;
      })}
    </Grid>
  );
};

export default LatestProducts;
