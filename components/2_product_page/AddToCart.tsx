/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useEffect, useCallback, useState, Fragment } from "react";
import type { FC } from "react";

import { useActor } from "@xstate/react";

import axios from "axios";

import {
  Button,
  Card,
  Grid,
  makeStyles,
  CardActions,
  Typography,
  CardContent,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import { Rating, Alert } from "@material-ui/lab";

// import { useSession } from "next-auth/client";

import { cartService, fse, EE } from "../../machines/cart-machine";

import type { ProductPageProps } from "../../pages/products/[prodId]";

const useStyles = makeStyles({
  butti: {
    width: "100%",
  },
});

interface PropsI {
  initialProductLoaded: ProductPageProps["product"];
}

const AddToCart: FC<PropsI> = ({ initialProductLoaded }) => {
  const { butti } = useStyles();

  const [state, dispatch] = useActor(cartService);

  const { context } = state;

  const { cart } = context;

  let amount: number = 0;
  let countInStock: number = initialProductLoaded.countInStock;
  const price: number = initialProductLoaded.price;
  const productId = initialProductLoaded.productId;

  if (cart[productId]) {
    console.log({ DATA: cart[productId] });

    amount = cart[productId].amount;
    countInStock = cart[productId].countInStock;
  }

  const loading =
    state.value === fse.adding_item ||
    state.value === fse.removing_item ||
    state.value === fse.erasing_everything;

  return (
    <Fragment>
      {cartService.initialized && (
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
          <Paper>
            <Card>
              <CardContent>
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    border: #19181a solid 1px;
                    border-bottom: transparent;
                    padding: 4px;

                    & span.red {
                      color: crimson;
                    }
                    & span.green {
                      color: #387e61;
                      font-weight: bold;
                    }
                  `}
                >
                  <Typography variant="body1">status:</Typography>
                  <Typography variant="body1">
                    {countInStock ? (
                      <span className="green">In Stock</span>
                    ) : (
                      <span className="red">Out Of Stock</span>
                    )}
                  </Typography>
                </div>
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    border: #19181a solid 1px;
                    padding: 4px;
                  `}
                >
                  <Typography variant="body1">price:</Typography>
                  <Typography variant="body1">${price}</Typography>
                </div>
              </CardContent>
              <CardActions>
                <Button
                  className={butti}
                  variant="contained"
                  size="large"
                  color="primary"
                  onClick={() => {
                    dispatch({
                      type: EE.ADD_ITEM,
                      payload: {
                        item: {
                          amount: 1,
                          countInStock,
                          price,
                          productId,
                        },
                      },
                    });
                  }}
                  disabled={countInStock <= 0 || loading}
                >
                  {countInStock === 0
                    ? "Out Of Stock"
                    : amount < 1
                    ? "Add To Cart"
                    : "Add One More"}{" "}
                </Button>

                {amount > 0 && (
                  <Button
                    className={butti}
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={() => {
                      dispatch({
                        type: EE.REMOVE_ITEM,
                        payload: {
                          item: {
                            amount: 1,
                            countInStock,
                            price,
                            productId,
                          },
                        },
                      });
                    }}
                    disabled={/* amount >= countInStock || */ loading}
                  >
                    Remove One
                  </Button>
                )}
              </CardActions>

              <div
                className="circ-prog"
                css={css`
                  display: flex;
                  justify-content: center;
                  height: 16px;
                `}
              >
                {loading && <CircularProgress size={19} color="primary" />}
              </div>

              <div
                css={css`
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;

                  padding: 0 10px;
                  & h5 {
                    margin-right: 18px;
                    user-select: none;
                  }
                  /* 
              & > input {

          } */
                `}
              >
                <h5>
                  Left Products In Stock:{" "}
                  <span
                    css={css`
                      color: #5f3483;
                      font-size: 1.3em;
                    `}
                  >
                    {countInStock}
                  </span>
                </h5>
                {amount > 0 && (
                  <h5>
                    Added To Your Cart:{" "}
                    <span
                      css={css`
                        color: #5f3483;
                        font-size: 1.3em;
                      `}
                    >
                      {amount}
                    </span>
                  </h5>
                )}
              </div>
            </Card>
            <Card>
              <div
                style={{
                  borderColor: amount > 0 ? "crimson" : "olive",
                }}
                css={css`
                  border: solid 2px;
                  border-radius: 5px;
                `}
              >
                {amount > 0 && (
                  <Button
                    className={butti}
                    variant="contained"
                    size="small"
                    color="secondary"
                    onClick={() => {
                      dispatch({
                        type: EE.REMOVE_ITEM,
                        payload: {
                          item: {
                            amount: 1,
                            countInStock,
                            price,
                            productId,
                          },
                        },
                      });
                    }}
                    disabled={loading}
                  >
                    Clear Product From Cart
                  </Button>
                )}
              </div>
            </Card>
          </Paper>
        </Grid>
      )}
    </Fragment>
  );
};

export default AddToCart;
