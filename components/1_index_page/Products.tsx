/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { Grid, Typography, makeStyles } from "@material-ui/core";

import type { ProductsListType } from "../../dummy/products";

import ProductCard from "./ProductCard";

const useStyles = makeStyles({
  gridCont: {
    flexGrow: 1,
  },
});

const LatestProducts: FC<{
  products: ProductsListType;
}> = ({ products }) => {
  const { gridCont } = useStyles();

  return (
    <div
      css={css`
        margin: 10px auto;
        width: fit fit-content;
        /* border: pink solid 1px; */
        /* text-align: center; */

        & .gridCont > * {
          margin: 2px auto;
        }
      `}
    >
      <Typography variant="h2" component="h6">
        Latest Products
      </Typography>
      <Grid
        className={gridCont}
        //
        container
        spacing={2}
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
