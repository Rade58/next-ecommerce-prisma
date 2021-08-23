# PROFILE PAGE AND PROFILE BUTTON ON HEADER

LETS START FROM HEADER: **IF USER IS LOGGED IN, WHICH IS REPRESENTED BY PRESENCE OF SESSION OBJECT, `WE CAN SHOW PROFILE BUTTON INSTEAD OF LOGIN BUTTON`**

```
touch components/ProfileMenu.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState } from "react";
import type { FC, MouseEvent } from "react";

import { useRouter } from "next/router";

import { Button, Menu, MenuItem } from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import { signOut } from "next-auth/client";

interface ProfileMenuProps {
  name: string | null | undefined;
  email: string | null | undefined;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ email, name }) => {
  const { push } = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      css={css`
        margin-right: 2em;

        & > button:nth-of-type(1) {
          text-transform: lowercase;
          font-size: 0.96em;
        }
      `}
    >
      <Button
        size="small"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        color="secondary"
      >
        <span>{` ${name || email || "profile"}`.toLowerCase()}</span>
        <ExpandMore />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            push("/profile");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            signOut();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ProfileMenu;

```

HOOKING P PROFILE MENU TO THE HEADER

```
code components/Header.tsx
```

```tsx
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

// I NEED SESSION
import { useSession } from "next-auth/client";
//
// AND I NEED PROFILE MENU
import ProfileMenu from "./ProfileMenu";
//

import { useAppBarStyles, useLogoStyles, colors_enum } from "../theme";

const Header: FC = () => {
  // SESSION
  const [session, loading] = useSession();
  //

  const { butt } = useAppBarStyles();
  const { logo } = useLogoStyles();

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar color="primary">
        <IconButton
          onClick={() => {
            Router.push("/");
          }}
          edge="start"
          color="inherit"
          aria-label="menu"
          className={logo}
        >
          <Typography>
            FANCY PARROT{" "}
            <span
              css={css`
                font-size: 1.4em;
              `}
            >
              🦜
            </span>
          </Typography>
        </IconButton>
        {/* <Typography variant="h6">Hello World</Typography> */}
        <nav
          css={css`
            /* border: pink solid 1px; */
            display: flex;
            justify-content: space-evenly;
            margin-left: auto;
            min-width: 150px;
          `}
        >

          {session ? (
            {/* IF SESSION IS HERE SHOW PROFILE MENU
            OTHERWISW SHOW LOGIN BUTTON */}
            <ProfileMenu
              email={session.user?.email}
              name={session.user?.name}
            />
          ) : (
            <Button
            
              onClick={() => Router.push("/signin")}
              color="secondary"
              variant="contained"
            >
              Login
            </Button>
          )}
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
  );
};

export default Header;
```
