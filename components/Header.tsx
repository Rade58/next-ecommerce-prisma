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

  const toggleDrawer =
    (anchor: Anchor, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const [xState, dispatch] = useActor(cartService);

  const anchor = "top";

  return (
    <div>
      <Fragment>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={toggleDrawer("top", true)}
        >
          <ShopIcon />
        </Button>
        <Drawer
          anchor={"top"}
          open={state["top"]}
          onClose={toggleDrawer("top", false)}
        >
          <ShoppingCart />

          <div
            className={clsx(classes.list, {
              [classes.fullList]: anchor === "top" || anchor === "bottom",
            })}
            role="presentation"
            onClick={toggleDrawer("top", false)}
            onKeyDown={toggleDrawer("top", false)}
          >
            <Divider />
            <List>
              <ListItem button>
                <div
                  css={css`
                    border: pink solid 1px;
                    display: flex;
                    justify-content: center;
                    /* width: 100%; */
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

  // DO THINGS NOW ONLY IF YOU LANDED ON SIGNIN PAGE
  // const [stateSh, dispatchSh] = useActor(shippingNavService);

  /*  useEffect(() => {
    // ONLI FOR THE      intended_to_go_to_shipping

    if (stateSh.context.intended_to_go_to_shipping) {
      // ONLY FOR THE     /signin      PAGE

      debugger;

      if (Router.asPath === "/signin" || Router.asPath === "/") {
        // WE HAVE TWO CASES BEFORE SIGNIN OR AFTER

        // ON AFTER WE NEED TO REDIRECT TO SHIPPING PAGE
        // WE NEED TO DISPATCH SIGNIN EVENT WHE USER SIGNS IN

        if (stateSh.value === fsee.landed_on_signin_before_auth) {
          if (session) {
            dispatchSh({
              type: EEE.MARK_SIGNED_IN,
              payload: true,
            });
          }
        }
      }
    }
  }, [Router, Router.asPath, session, stateSh, dispatchSh]);
  useEffect(() => {
    // ONLI FOR THE      intended_to_go_to_shipping

    if (stateSh.context.intended_to_go_to_shipping) {
      // ONLY FOR THE     /signin      PAGE

      debugger;

      if (Router.asPath === "/signin" || Router.asPath === "/") {
        // WE HAVE TWO CASES BEFORE SIGNIN OR AFTER

        // ON AFTER WE NEED TO REDIRECT TO SHIPPING PAGE

        // HERE WE DO THE REDIRECT

        if (stateSh.value === fsee.landed_on_signin_after_auth) {
          debugger;

          if (session) {
            Router.push("/shipping");
          }
        }
      }
    }
  }, [Router, Router.asPath, session, stateSh, dispatchSh]); */

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

  // DISPATCHING TICKING EVENT (HERE AND NOT INSIDE CART
  //  BECAUSE WE MOUNT AND UNMOUNT CART WHEN WE CLOSE/OPEN DRAWER)
  /* useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({
        type: EE.TICK,
      });
    }, 8000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]); */
  //

  /* const [intention, setIntention] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (intention) return;

    console.log(Router.asPath);

    if (Router.asPath.includes("/veryify-email-info")) return;

    const a = CookieStore.checkShippingNavIntent();

    if (a) {
      setIntention("hello world");
      CookieStore.deleteShippIntent;
      Router.push("/shipping");
    }
  }, [Router, Router.asPath, intention, setIntention]); */

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
        <Search />

        <nav
          css={css`
            /* border: pink solid 1px; */
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
            <ProfileMenu
              // IT IS IMPORTANT TO PASS ID
              profileId={profId || ""}
              email={session.user?.email}
              name={session.user?.name}
            />
          ) : (
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

          {session &&
            (session as unknown as any)?.profile?.role === "ADMIN" && (
              <AdminButton
                profileId={profId || ""}
                isAdmin={(session as unknown as any)?.profile?.role === "ADMIN"}
              />
            )}
          {/* -------------------------DRAWER ()------------------------ */}

          <TemporaryDrawer />
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
