/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";

import type { ProductType } from "../../dummy/products";

const Product: FC<{ product: ProductType }> = ({ product }) => {
  const {} = product;

  return <Card></Card>;
};

export default Product;
