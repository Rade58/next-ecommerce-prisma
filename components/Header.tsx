/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment, useEffect, useState } from "react";
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

import AdminButton from "./AdminButton";

import { useAppBarStyles, useLogoStyles, colors_enum } from "../theme";

const Header: FC = () => {
  // SESSION
  const [session, loading] = useSession();
  //
  //  WE NEED PROFILE ID FROM THE SESSION
  /* let profileId;

  if (session?.profile) {
    profileId = (session?.profile as { id: string }).id as string;
  } else {
    profileId = "";
  } */

  const [profId, setProfId] = useState<string>("");

  useEffect(() => {
    if (session) {
      setProfId((session?.profile as { id: string }).id as string);
    }
  }, [session, setProfId]);

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
            <span
              style={{
                display: "block",
                fontSize: "0.8em",
                fontFamily: "monospace",
                marginBottom: "-14px",
                fontWeight: 400,
                marginRight: "6px",
                color: "olivedrab",
              }}
            >
              FANCY{" "}
            </span>
            <span
              style={{
                fontSize: "0.8em",
                fontFamily: "ubuntu",
                fontWeight: 700,
                color: "tomato",
              }}
            >
              PARROT{" "}
            </span>
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
          {/* IF SESSION IS HERE SHOW PROFILE MENU */}
          {/* OTHERWISE SHOW LOGIN BUTTON */}
          {session ? (
            <ProfileMenu
              // IT IS IMPORTANT TO PASS ID
              profileId={profId || ""}
              email={session.user?.email}
              name={session.user?.name}
            />
          ) : (
            <Button
              // INSTEAD OF THIS
              // onClick={() => Router.push("/api/auth/signin")}
              // THIS
              onClick={() => Router.push("/signin")}
              color="secondary"
              variant="contained"
              disabled={loading}
              // className={butt}
            >
              Login
            </Button>
          )}
          {/* IF PROFILE IS WITH ROLE ADMIN WE CAN RENDER THIS BUTTON */}
          {session &&
            (session as unknown as any)?.profile?.role === "ADMIN" && (
              <AdminButton
                profileId={profId || ""}
                isAdmin={(session as unknown as any)?.profile?.role === "ADMIN"}
              />
            )}
          {/* ------------------------------------------------- */}
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
