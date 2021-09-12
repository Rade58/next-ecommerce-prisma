/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment } from "react";

import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Typography,
} from "@material-ui/core";

import { useActor } from "@xstate/react";

import { cartService, fse, EE } from "../machines/cart-machine";

interface PropsI {
  placeholder?: string;
}

const ShoppingCart: FC<PropsI> = ({}) => {
  const [state, dispatch] = useActor(cartService);

  const { cart } = state.context;

  const cartKeys = Object.keys(cart);

  return (
    <div
      css={css`
        width: 72%;
        margin: 2px auto;

        @media screen and (max-width: 720px) {
          width: 96%;
        }
      `}
    >
      <h1>Shopping Cart</h1>
      <div></div>

      <List>
        {cartKeys.map((key) => {
          const { amount, countInStock, price } = cart[key];

          const { image, name, brand } = cart[key].product;

          /*  let nome = name;
          let brando = brand; */
          /* 
          if (nome.length > 30) {
            nome = nome.slice(0, 29) + "...";

            console.log({ nome });
          }

          if (brando.length > 30) {
            brando = brando.slice(0, 29) + "...";
          } */

          return (
            <Fragment key={key}>
              {" "}
              {amount !== 0 ? (
                <ListItem button>
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      border-left: #df5470 solid 4px;
                      width: 100%;
                      padding-left: 5px;
                      flex-wrap: wrap;

                      & h5 {
                        border: pink solid 1px;
                      }

                      & .brando {
                        display: inline;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 120px;
                        /* border: pink solid 1px; */
                        max-height: 1.2em;
                      }

                      & .nome {
                        width: 120px;
                      }

                      & .ex,
                      & .amount {
                        @media screen and (max-width: 900px) {
                          /* justify-self: flex-end; */
                          /* align-self: flex-end; */
                          width: 50%;
                        }
                      }
                    `}
                  >
                    {/* {cart[key].product.brand} */}
                    <Avatar src={image} />
                    <h5 className="nome">{name}</h5>
                    <h5 className="brando">{brand}</h5>
                    <h5>{price}</h5>
                    <h5 className="amount">{amount}</h5>
                    <h5 className="ex">x</h5>
                  </div>
                </ListItem>
              ) : null}
            </Fragment>
          );
        })}
      </List>
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
