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
    <div>
      <h1>Shopping Cart</h1>
      <div></div>

      <List>
        {cartKeys.map((key) => {
          const { amount, countInStock, price } = cart[key];

          const { image, name, brand } = cart[key].product;

          let nome = name;
          let brando = brand;
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
                      border: crimson solid 1px;
                      width: 100%;

                      & .brando {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: no-wrap;
                        width: 120px;
                        border: pink solid 1px;
                        max-height: 1.2em;
                      }

                      /* & .nome {

                      } */
                    `}
                  >
                    {/* {cart[key].product.brand} */}
                    <Avatar src={image} />
                    <h5 className="nome">{nome}</h5>
                    <h5 className="brando">{brando}</h5>
                    <h5>{amount}</h5>
                    <h5>{price}</h5>
                    <h5>x</h5>
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
