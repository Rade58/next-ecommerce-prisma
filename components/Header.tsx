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
import { Menu as MenuIcon } from "@material-ui/icons";

import { useAppBarStyles } from "../theme";

const Header: FC = () => {
  const { butt } = useAppBarStyles();

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar color="primary">
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">News</Typography>
        <Button className={butt} color="inherit">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
