/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useEffect, useCallback, useState } from "react";
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

import { useSession } from "next-auth/client";

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

  let amount: number = 1;
  let countInStock: number = initialProductLoaded.countInStock;
  const price: number = initialProductLoaded.price;
  const productId = initialProductLoaded.productId;

  if (cart[productId]) {
    amount = cart[productId].amount;
    countInStock = cart[productId].countInStock;
  }

  const [productCartObject, setProductCartObject] = useState<{
    productId: string;
    price: number;
    countInStock: number;
  }>({
    productId: initialProductLoaded.productId,
    price: initialProductLoaded.price,
    countInStock: initialProductLoaded.countInStock,
  });

  const getProductData = useCallback(() => {
    // GETTING DATA
    // COUNT IN STOCK IS IMPORTANT
    // THIS SHOULD BE EXECUTED EVERY TIME USER ITERACTS WITH
    // ANYTHING
    // -------- EVERY TIME HE MAKES REQUEST OT ADD TO CART OR REMOVE FROM CART
    // BUT I THINK WE COVERED THAT LOGIC INSIDE MACHINE
  }, []);

  useEffect(() => {
    // MAKE REQUSET TO GET COUNT IN STOCK
  }, []);

  return (
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
              `}
            >
              <Typography variant="body1">status:</Typography>
              <Typography variant="body1">
                {countInStock ? "In Stock" : "Out Of Stock"}
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
              disabled={amount > countInStock}
            >
              {amount > countInStock ? "Stock Exceeded" : "Add To Cart"}
            </Button>
          </CardActions>
          {/* I DON NEED THIS IT IS TOO MUCH
            AMOUT SHOULD BE ONLY AVAILABLE TO ADD OR REMOVE IN CART
            // BUT WE CAN ADD REMOVE FROM CART LOGIC
          
          */}
          <div
            css={css`
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;

              padding: 0 10px;
              & h4 {
                margin-right: 18px;
                user-select: none;
              }
              /* 
          & > input {

          } */
            `}
          >
            <h4>DATA:</h4>

            <h5>Count in Stck: {countInStock}</h5>

            <h5>Amount taken: {amount}</h5>

            {/* TWO BUTTONS
              ONE FOR ADDING TO CART AND OTHER FOR REMOVING
            */}

            {/* 
            <TextField
              size="medium"
              color="secondary"
              type="number"
              value={amount}
              onChange={(e) => {
                if (!e.target.value) return;
                if (parseInt(e.target.value) < 1) return;

                // setAmount(parseInt(e.target.value as string));


              }}
            /> */}
          </div>
        </Card>
      </Paper>
    </Grid>
  );
};

export default AddToCart;
