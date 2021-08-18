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
  return <Grid></Grid>;
};

export default LatestProducts;
