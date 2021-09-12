/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { Button } from "@material-ui/core";

import type { Anchor } from "./Header";

interface PropsI {
  placeholder?: string;
}

const ShoppingCart: FC<PropsI> = ({}) => {
  return (
    <div>
      <h1>Hello Shopping Cart</h1>
      <div></div>
    </div>
  );
};

export default ShoppingCart;
