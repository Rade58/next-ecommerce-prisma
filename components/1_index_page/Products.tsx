/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useEffect, useState, useCallback, useRef } from "react";

import Link from "next/link";
import Router from "next/router";

import {
  // Grid,
  Typography,
  makeStyles,
  CircularProgress,
  Card,
  Link as MuiLink,
  Button,
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

        @media screen and (max-width: 800px) {
          & h6 {
            font-size: 3em;
          }
        }

        display: flex;
        flex-direction: column;
      `}
    >
      <Typography variant="h2" component="h6">
        Latest Products
      </Typography>

      {/* <Button
        onClick={() => {
          Router.push("/prods/1");
        }}
      >
        More
      </Button> */}
      {!loading /* && listRenderingAllowed */ && (
        <div
          css={css`
            width: 80%;

            @media screen and (max-width: 600px) {
              width: 94%;
            }

            margin: 20px auto;

            justify-content: space-evenly;

            display: flex;
            flex-wrap: wrap;

            & > div.my-card {
              flex-basis: 220px;
              flex-grow: 1;
              flex-shrink: 1;
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
      <div
        css={css`
          margin-top: 2em;
          display: flex;
          justify-content: center;

          & a {
            font-size: 2em;
            color: #4f3b75;
          }
        `}
      >
        {products.length !== 0 && (
          <Link href="/prods/1" passHref>
            <MuiLink>See More products</MuiLink>
          </Link>
        )}
      </div>
    </div>
  );
};

export default LatestProducts;
