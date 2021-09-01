/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useEffect, useState, useCallback, useRef } from "react";

import {
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
// import type { Product as ProductType } from "@prisma/client";

import { Alert } from "@material-ui/lab";

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

  const [requestStatus, setRequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  const requestStatusRef = useRef<typeof requestStatus>(requestStatus);

  const [cursor, setCursor] = useState<string>(
    products[products.length - 1].productId
  );

  useEffect(() => {
    setCursor(products[products.length - 1].productId);
  }, [products]);

  const fetchNewProducts = useCallback(async () => {
    //

    try {
      setRequestStatus("pending");

      const { data } = await axios.post("/api/products", cursor, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!data) {
        setRequestStatus("idle");
        return;
      }

      setProducts((prev) => {
        return { ...prev, ...(data as typeof products) };
      });

      setRequestStatus("idle");
    } catch (error) {
      console.error(error);

      setRequestStatus("rejected");

      setTimeout(() => {
        setRequestStatus("idle");
      }, 3000);
    }
  }, [setProducts, cursor, setRequestStatus]);

  useEffect(() => {
    if (!window.onscroll) {
      window.onscroll = () => {
        if (requestStatusRef.current === "pending") return;

        if (
          document.documentElement.scrollHeight -
            (document.documentElement.scrollTop +
              document.documentElement.clientHeight) ===
          0
        ) {
          // console.log("fetch data");

          fetchNewProducts();
        }
      };
    }

    return () => {
      window.onscroll = null;
    };
  }, [requestStatusRef, fetchNewProducts]);

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
        {requestStatus === "pending" && (
          <CircularProgress color="primary" size={28} />
        )}
        {requestStatus === "rejected" && (
          <Alert severity="error">
            Could{"'"}t fetch products (server problem)
          </Alert>
        )}
      </Grid>
    </div>
  );
};

export default LatestProducts;
