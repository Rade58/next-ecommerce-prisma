/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useEffect, useState, useCallback, useRef } from "react";

import {
  // Grid,
  Typography,
  makeStyles,
  CircularProgress,
  Card,
} from "@material-ui/core";
// import type { Product as ProductType } from "@prisma/client";

import { Alert, Skeleton } from "@material-ui/lab";

import axios from "axios";

import { useSession } from "next-auth/client";

// import type { ProductsListType } from "../../dummy/products";

import type { Products as ProductsType } from "../../pages/index";
import ProductCard from "./ProductCard";

const LatestProducts: FC<{
  products: ProductsType;
}> = ({ products /* : prods */ }) => {
  const [session, loading] = useSession();

  /* const [products, setProducts] = useState<typeof prods>(prods);
  
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  const [cursor, setCursor] = useState<string>(
    products[products.length - 1].productId
  );

  useEffect(() => {
    setCursor(products[products.length - 1].productId);
  }, [products]);

  const [listRenderingAllowed, setListRenderingAllowed] =
    useState<boolean>(false);

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
      setListRenderingAllowed(true);

      window.onscroll = () => {
        console.log(requestStatus === "pending");

        if (requestStatus === "pending") return;

        console.log(
          (100 * document.documentElement.scrollTop) /
            (document.documentElement.scrollHeight -
              document.documentElement.clientHeight)
        );

        if (
          (100 * document.documentElement.scrollTop) /
            (document.documentElement.scrollHeight -
              document.documentElement.clientHeight) >
          90
        ) {
          fetchNewProducts();
        }
      };
    }

    return () => {
      window.onscroll = null;
    };
  }, [
    fetchNewProducts,
    setRequestStatus,
    requestStatus,
    setListRenderingAllowed,
  ]); */

  console.log({ products });

  return (
    <div
      css={css`
        margin: 10px auto;

        width: 100%;

        & h6 {
          margin-top: 20px;
          margin-bottom: 12px;
          margin-left: auto;
          margin-right: auto;
        }

        display: flex;
        flex-direction: column;
      `}
    >
      <Typography variant="h2" component="h6">
        Latest Products
      </Typography>
      {!loading /* && listRenderingAllowed */ && (
        <div
          css={css`
            width: 75%;

            @media screen and (max-width: 600px) {
              width: 94%;
            }

            margin: 20px auto;

            justify-content: space-evenly;

            display: flex;
            flex-wrap: wrap;

            & > div.my-card {
              flex-basis: 280px;
              flex-grow: 1;
              flex-shrink: 2;
              margin: 16px;
            }
          `}
        >
          {/* {requestStatus !== "pending" && */}
          {products.map((product) => {
            return (
              <ProductCard
                product={product}
                key={`${product.productId}-${Math.random()}-${product.name}`}
              />
            );
          })}
          {/* {requestStatus === "pending" && ( */}
          {loading && (
            <Skeleton variant="rect" width="100%" height="100%">
              {products.map((product, i) => {
                return (
                  <Card key={`${product.productId}-${i + 4}`}>Hello World</Card>
                );
              })}
            </Skeleton>
          )}
          {/* } */}
          {/* {requestStatus === "pending" && ( */}
          {loading && (
            <div
              css={css`
                z-index: 4;
                display: flex;
                justify-content: center;
                position: fixed;

                bottom: 12vh;

                & > * {
                  text-align: center;
                }
              `}
            >
              <CircularProgress color="primary" size={48} />
            </div>
          )}
          {/* )} */}
          {/* {requestStatus === "rejected" && ( */}
          {/* <Alert severity="error">
            Could{"'"}t fetch products (server problem)
          </Alert> */}
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default LatestProducts;
