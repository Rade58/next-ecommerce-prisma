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

import Search from "./Search";

import { useAppBarStyles, useLogoStyles, colors_enum } from "../theme";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
// import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

type Anchor = "right";

function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = useState({
    right: false,
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

  const list = (anchor = "right") => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer("right", false)}
      onKeyDown={toggleDrawer("right", false)}
    >
      <List>
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

  return (
    <div>
      <Fragment>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={toggleDrawer("right", true)}
        >
          <ShopIcon />
        </Button>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </Fragment>
    </div>
  );
}

const Header: FC = () => {
  const Router = useRouter();

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

  useEffect(() => {
    // console.log(Router.asPath);

    if ((session as unknown as any)?.profile?.role === "BANNED") {
      if (Router.asPath === "/banned") {
        return;
      }
      Router.push("/banned");
    }
  }, [session, Router]);

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
        {/* <Typography variant="h6">Hello World</Typography> */}
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
              className="signin"
              // INSTEAD OF THIS
              // onClick={() => Router.push("/api/auth/signin")}
              // THIS
              onClick={() => Router.push("/signin")}
              color="secondary"
              variant="contained"
              disabled={loading}
              size="small"
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

          <TemporaryDrawer />

          {/* <Button
            onClick={() => Router.push("/cart")}
            color="secondary"
            variant="contained"
            // className={butt}
            size="small"
          >
            <ShopIcon />
          </Button> */}
        </nav>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
