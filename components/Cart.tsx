/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { Button } from "@material-ui/core";

import type { Anchor } from "./Header";

interface PropsI {
  openModal: (
    anchor: "top",
    open: boolean
  ) => (event: KeyboardEvent | MouseEvent) => void;
  closeModal: (
    anchor: "top",
    open: boolean
  ) => (event: KeyboardEvent | MouseEvent) => void;
}

const ShoppingCart: FC<PropsI> = ({ closeModal, openModal }) => {
  console.log({ openModal, closeModal });

  return (
    <div>
      <h1>Hello Shopping Cart</h1>
      <div>
        <Button onClick={openModal}>Close</Button>
        <Button onClick={closeModal}>Open</Button>
      </div>
    </div>
  );
};

export default ShoppingCart;
