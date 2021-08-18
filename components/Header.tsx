/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment } from "react";
import type { FC } from "react";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import { Menu as MenuIcon, ShoppingCart as ShopIcon } from "@material-ui/icons";

import { useAppBarStyles } from "../theme";

const Header: FC = () => {
  const { butt } = useAppBarStyles();

  return (
    <header
      css={css`
        position: sticky;
        top: 0;
        /* height: 64px; */
      `}
    >
      <AppBar position="relative" color="primary">
        <Toolbar color="primary">
          <IconButton
            onClick={() => {
              console.log("Hello Button World");
            }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <nav
            css={css`
              margin: auto;
            `}
          >
            <Typography variant="h6">Hello World</Typography>
          </nav>
          <Button color="secondary" variant="contained" className={butt}>
            Login
          </Button>
          <Button color="secondary" variant="contained" className={butt}>
            <ShopIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
