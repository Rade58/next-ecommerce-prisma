/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useEffect, useState, useCallback, useRef, Fragment } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import {
  // Grid,
  Typography,
  makeStyles,
  CircularProgress,
  Card,
  Link as MuLink,
} from "@material-ui/core";
// import type { Product as ProductType } from "@prisma/client";

import { Alert, Skeleton } from "@material-ui/lab";

import { useSession } from "next-auth/client";

// import type { ProductsListType } from "../../dummy/products";

import type { Products as ProductsType } from "../../pages/index";
import ProductCard from "../1_index_page/ProductCard";

const LatestProducts: FC<{
  products: ProductsType;
}> = ({ products /* : prods */ }) => {
  const [session, loading] = useSession();

  console.log({ products });

  const { query, push: rPush } = useRouter();

  const { pageNum: pageVal } = query;

  if (!pageVal) {
    return null;
  }

  if (typeof pageVal === "object") {
    return null;
  }

  const pageNum = parseInt(pageVal);

  return (
    <Fragment>
      <div>
        {pageNum - 1 && (
          <Link href={`/products/p/${pageNum - 1}`} passHref>
            <MuLink>Prev</MuLink>
          </Link>
        )}

        <Link href={`/products/p/${pageNum + 1}`} passHref>
          <MuLink>Next</MuLink>
        </Link>
      </div>

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
                    <Card key={`${product.productId}-${i + 4}`}>
                      Hello World
                    </Card>
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
    </Fragment>
  );
};

export default LatestProducts;
