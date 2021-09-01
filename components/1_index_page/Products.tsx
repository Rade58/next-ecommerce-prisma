/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useEffect, useState, useCallback } from "react";

import { Grid, Typography, makeStyles } from "@material-ui/core";
// import type { Product as ProductType } from "@prisma/client";

import axios from "axios";

// import type { ProductsListType } from "../../dummy/products";

import type { Products as ProductsType } from "../../pages/index";
import ProductCard from "./ProductCard";

const useStyles = makeStyles({
  gridCont: {
    flexGrow: 1,
  },
});

const LatestProducts: FC<{
  products: ProductsType;
}> = ({ products: prods }) => {
  const { gridCont } = useStyles();

  const [products, setProducts] = useState<typeof prods>(prods);

  const [cursor, setCursor] = useState<string>(
    products[products.length - 1].productId
  );

  useEffect(() => {
    setCursor(products[products.length - 1].productId);
  }, [products]);

  const fetchNewProducts = useCallback(async () => {
    //
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      if (
        document.documentElement.scrollHeight -
          (document.documentElement.scrollTop +
            document.documentElement.clientHeight) ===
        0
      ) {
        console.log("fetch data");
      }
    };

    return () => {
      window.onscroll = null;
    };
  }, []);

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

        & h6 {
          margin-top: 20px;
          margin-bottom: 12px;
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
