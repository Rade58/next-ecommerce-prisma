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

const LatestProducts: FC<{
  products: ProductsType;
}> = ({ products: prods }) => {
  const [products, setProducts] = useState<typeof prods>(prods);

  // console.log({ products });

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

      const { data } = await axios.post(
        "/api/products",
        { cursor },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log({ data });

      if (!data) {
        setRequestStatus("idle");
        return;
      }

      setProducts((prev) => {
        return [...prev, ...(data as typeof products)];
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
        /* width: fit-content; */
        /* text-align: center; */

        border: pink solid 1px;

        width: 100%;

        & h6 {
          margin-top: 20px;
          margin-bottom: 12px;
        }

        display: flex;
        flex-direction: column;
      `}
    >
      <Typography variant="h2" component="h6">
        Latest Products
      </Typography>
      <div
        css={css`
          border: crimson solid 1px;
          width: 80%;

          @media screen and (max-width: 800px) {
            width: 98%;
          }

          margin: 20px auto;

          justify-content: space-evenly;

          display: flex;
          flex-wrap: wrap;

          & > * {
            flex-basis: 280px;
            flex-grow: 0;
          }
        `}
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
          <div
            style={{
              zIndex: 28,
              marginTop: "-10vh",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress color="primary" size={48} />
          </div>
        )}
        {requestStatus === "rejected" && (
          <Alert severity="error">
            Could{"'"}t fetch products (server problem)
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LatestProducts;
