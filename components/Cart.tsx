/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
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
      <h1>Hello Shopping Cart</h1>
      <div></div>

      <List>
        {cartKeys.map((key) => (
          <ListItem key={key} button>
            {cart[key].product.brand}
          </ListItem>
        ))}

        <ListItem button>
          <ListItemIcon>Content</ListItemIcon>
          <ListItemText primary={"something"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>Content</ListItemIcon>
          <ListItemText primary={"something"} />
        </ListItem>
      </List>
    </div>
  );
};

export default ShoppingCart;
