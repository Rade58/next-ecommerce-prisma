/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment, useEffect, useState } from "react";
import type { FC, MouseEvent, KeyboardEvent } from "react";

import { useRouter } from "next/router";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  Divider,
  ListItem,
} from "@material-ui/core";
import { ShoppingCart as ShopIcon, CloseOutlined } from "@material-ui/icons";

import { useSession } from "next-auth/client";

import { useActor } from "@xstate/react";

import { cartService, EE } from "../machines/cart-machine";

/* import {
  shippingNavService,
  EE as EEE,
  fse as fsee,
} from "../machines/shipping-nav-machine" */ import ProfileMenu from "./ProfileMenu";

import AdminButton from "./AdminButton";

import Search from "./Search";

import { useAppBarStyles, useLogoStyles } from "../theme";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import ShoppingCart from "./Cart";

import CookieStore from "../lib/cart-cookies";

cartService.start();
// shippingNavService.start();

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

export type Anchor = "top";

function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
  });

  // NO OP
  /* const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    }; */

  const [xState, dispatch] = useActor(cartService);

  const anchor = "top";

  const openDrawer = () => dispatch({ type: EE.TOOGLE_DRAWER, payload: true });
  const closeDrawer = () =>
    dispatch({ type: EE.TOOGLE_DRAWER, payload: false });

  const { asPath } = useRouter();

  const canRenderCartButton =
    asPath !== "/shipping" &&
    asPath !== "/payment" &&
    asPath !== "/place-order";

  return (
    <div>
      <Fragment>
        {canRenderCartButton && (
          <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick={openDrawer}
          >
            <ShopIcon />
          </Button>
        )}
        <Drawer
          anchor={"top"}
          open={xState.context.drawerOpened}
          onClose={closeDrawer}
        >
          <ShoppingCart />

          <div
            className={clsx(classes.list, {
              [classes.fullList]: anchor === "top" || anchor === "bottom",
            })}
            role="presentation"
            onClick={closeDrawer}
            onKeyDown={closeDrawer}
          >
            <Divider />
            <List>
              <ListItem button>
                <div
                  css={css`
                    border: pink solid 1px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto;
                    padding: 0 6px;
                    border-radius: 4px;
                    color: white;
                    background-color: #8f6291;

                    &:hover {
                      background-color: #335c5c9b;
                    }
                  `}
                >
                  <ListItemIcon>
                    <CloseOutlined color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={"Close"} />
                </div>
              </ListItem>
            </List>
          </div>
        </Drawer>
      </Fragment>
    </div>
  );
}

const Header: FC = () => {
  const Router = useRouter();

  // SESSION
  const [session, loading] = useSession();

  const [profId, setProfId] = useState<string>("");

  useEffect(() => {
    if (session) {
      setProfId((session?.profile as { id: string }).id as string);
    }
  }, [session, setProfId]);

  const { butt } = useAppBarStyles();
  const { logo } = useLogoStyles();

  useEffect(() => {
    if ((session as unknown as any)?.profile?.role === "BANNED") {
      if (Router.asPath === "/banned") {
        return;
      }
      Router.push("/banned");
    }
  }, [session, Router]);

  const [xState, dispatch] = useActor(cartService);

  const { asPath } = useRouter();

  const canRenderProfile =
    asPath !== "/shipping" &&
    asPath !== "/payment" &&
    asPath !== "/place-order";

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
              ????
            </span>
          </Typography>
        </IconButton>
        <Search />

        <nav
          css={css`
            border: pink solid 0px;
            display: flex;
            justify-content: space-evenly;
            margin-left: auto;
            min-width: 150px;

            & .signin {
              margin-right: 10px;
            }
          `}
        >
          {session ? (
            <Fragment>
              {canRenderProfile && (
                <ProfileMenu
                  profileId={profId || ""}
                  email={session.user?.email}
                  name={session.user?.name}
                />
              )}
            </Fragment>
          ) : (
            <Fragment>
              {canRenderProfile && (
                <Button
                  className="signin"
                  onClick={() => Router.push("/signin")}
                  color="secondary"
                  variant="contained"
                  disabled={loading}
                  size="small"
                >
                  Login
                </Button>
              )}
            </Fragment>
          )}

          {session &&
            (session as unknown as any)?.profile?.role === "ADMIN" && (
              <AdminButton
                profileId={profId || ""}
                isAdmin={(session as unknown as any)?.profile?.role === "ADMIN"}
              />
            )}

          <TemporaryDrawer />
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
