/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment } from "react";
import type { FC } from "react";

import Router from "next/router";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ShoppingCart as ShopIcon,
  EmojiObjectsTwoTone,
} from "@material-ui/icons";

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
              Router.push("/");
            }}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            🦜
          </IconButton>
          <Typography variant="h6">Hello World</Typography>
          <nav
            css={css`
              /* border: pink solid 1px; */
              display: flex;
              justify-content: space-evenly;
              margin-right: 1em;
              margin-left: auto;
              min-width: 150px;
            `}
          >
            <Button
              onClick={() => Router.push("/signin")}
              color="secondary"
              variant="contained"
              // className={butt}
            >
              Login
            </Button>
            <Button
              onClick={() => Router.push("/cart")}
              color="secondary"
              variant="contained"
              className={butt}
            >
              <ShopIcon />
            </Button>
          </nav>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
