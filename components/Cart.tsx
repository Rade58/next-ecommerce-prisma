/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useEffect } from "react";

import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Typography,
  CircularProgress,
} from "@material-ui/core";

import {
  DeleteForever,
  Add,
  Remove,
  DeleteOutlineRounded,
} from "@material-ui/icons";

import { useActor } from "@xstate/react";

import { cartService, fse, EE } from "../machines/cart-machine";

interface PropsI {
  placeholder?: string;
}

const ShoppingCart: FC<PropsI> = ({}) => {
  const [state, dispatch] = useActor(cartService);

  const { cart } = state.context;

  const cartKeys = Object.keys(cart);

  const disabled =
    state.value === fse.adding_item ||
    state.value === fse.removing_item ||
    state.value === fse.clearing_product ||
    state.value === fse.clearing_cart;

  return (
    <div
      css={css`
        width: 72%;
        margin: 2px auto;

        @media screen and (max-width: 720px) {
          width: 96%;
        }

        & li {
          cursor: default;
        }
        & li:hover {
          background-color: #6a658555;
        }
      `}
    >
      <h1>Shopping Cart</h1>
      <div
        css={css`
          display: flex;
          justify-content: center;
          height: 28px;
          /* border: tomato solid 2px; */
        `}
      >
        {disabled && <CircularProgress color="primary" size={24} />}
      </div>

      <List>
        {cartKeys.map((key) => {
          const { amount, countInStock, price, product, productId } = cart[key];

          const { image, name, brand } = cart[key].product;

          return (
            <Fragment key={key}>
              {" "}
              {amount !== 0 ? (
                <Fragment>
                  <ListItem>
                    <div
                      css={css`
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-left: #8f6291 solid 4px;
                        border-radius: 4px;
                        width: 100%;
                        padding-left: 15px;
                        flex-wrap: wrap;

                        & h5 {
                          /* border: pink solid 1px; */
                        }

                        & .brando {
                          display: inline;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          width: 120px;
                          /* border: pink solid 1px; */
                          max-height: 1.2em;

                          @media screen and (max-width: 900px) {
                            /* justify-self: flex-end; */
                            /* align-self: flex-end; */
                            display: none;
                          }
                        }

                        & .nome {
                          text-align: center;
                          padding: 0 16px;

                          min-width: 120px;
                          @media screen and (max-width: 900px) {
                            /* justify-self: flex-end; */
                            /* align-self: flex-end; */
                            /* width: 100px; */
                          }
                        }

                        & .ex,
                        & .amount {
                          @media screen and (max-width: 900px) {
                            /* justify-self: flex-end; */
                            /* align-self: flex-end; */
                            width: 30%;
                          }

                          & button,
                          & span.am {
                            border-bottom: #8f6291 solid 2px;
                          }
                        }
                        & .price {
                          color: #181633;
                          font-size: 1.1em;
                          font-weight: 400;
                          display: flex;
                          align-items: center;

                          & span {
                            color: green;

                            font-size: 1.4em;
                          }
                        }
                      `}
                    >
                      {/* {cart[key].product.brand} */}
                      <Avatar src={image} />
                      <h5 className="nome">{name}</h5>
                      <h5 className="brando">{brand}</h5>
                      <h5 className="price">
                        <span>$ </span>
                        {price}
                      </h5>
                      <div
                        className="amount"
                        css={css`
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          min-width: 136px;
                          /* border-bottom: crimson solid 2px; */
                          @media screen and (max-width: 458px) {
                            /* justify-self: flex-end; */
                            /* align-self: flex-end; */
                            width: 300px;
                          }
                          @media screen and (max-width: 596px) {
                            /* justify-self: flex-end; */
                            /* align-self: flex-end; */
                            margin-left: auto;
                          }
                        `}
                      >
                        <Button
                          disabled={disabled}
                          onClick={() => {
                            // console.log("something");
                            dispatch({
                              type: EE.REMOVE_ITEM,
                              payload: {
                                item: {
                                  amount: 1,
                                  countInStock,
                                  price,
                                  productId,
                                  product,
                                },
                              },
                            });
                          }}
                        >
                          <Remove />
                        </Button>
                        <span>{amount}</span>

                        <Button
                          disabled={countInStock <= 0 || disabled}
                          onClick={() => {
                            // console.log("something");
                            dispatch({
                              type: EE.ADD_ITEM,
                              payload: {
                                item: {
                                  amount: 1,
                                  countInStock,
                                  price,
                                  productId,
                                  product,
                                },
                              },
                            });
                          }}
                        >
                          <Add />
                        </Button>
                      </div>
                      <div
                        className="ex"
                        css={css`
                          display: flex;
                          justify-content: center;
                          align-items: center;

                          @media screen and (max-width: 935px) {
                            margin-left: auto;
                            /* width: 220px; */
                          }
                        `}
                      >
                        <Button
                          disabled={disabled}
                          onClick={() => {
                            //
                            dispatch({
                              type: EE.CLEAR_PRODUCT,
                              payload: {
                                item: {
                                  amount,
                                  countInStock,
                                  price,
                                  productId,
                                  product,
                                },
                              },
                            });
                          }}
                        >
                          <DeleteForever />
                        </Button>
                      </div>
                    </div>
                  </ListItem>
                  <Divider />
                </Fragment>
              ) : null}
            </Fragment>
          );
        })}
      </List>
      <div
        css={css`
          display: flex;
          margin-top: 10px;
          margin-bottom: 10px;
          & button {
            margin-left: auto;
          }
        `}
      >
        {Object.values(cart).map((val) => {
          if (val.amount > 0) {
            return 1;
          }
        }).length > 1 && (
          <Button
            disabled={disabled}
            onClick={() => {
              dispatch({
                type: EE.CLEAR_CART,
              });
            }}
          >
            <span>Empty Your Cart</span>
            <DeleteOutlineRounded />
          </Button>
        )}
      </div>
      <Divider />
      {/* <List>
        <ListItem button>
          <ListItemIcon>Content</ListItemIcon>
          <ListItemText primary={"something"} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>Content</ListItemIcon>
          <ListItemText primary={"something"} />
        </ListItem>
      </List> */}
    </div>
  );
};

export default ShoppingCart;
