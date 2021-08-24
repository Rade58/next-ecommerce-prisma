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
  //  WE NEED PROFILE ID FROM THE SESSION
  let profileId;

  if (session?.profile) {
    profileId = (session?.profile as { id: string }).id as string;
  } else {
    profileId = "";
  }

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
          {/* IF SESSION IS HERE SHOW PROFILE MENU */}
          {/* OTHERWISE SHOW LOGIN BUTTON */}
          {session ? (
            <ProfileMenu
              // IT IS IMPORTANT TO PASS ID
              profileId={profileId || ""}
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
              // className={butt}
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

HOOKING UP PROFILE MENU TO THE HEADER

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
  //  WE NEED PROFILE ID FROM THE SESSION
  let profileId;

  if (session?.profile) {
    profileId = (session?.profile as { id: string }).id as string;
  } else {
    profileId = "";
  }

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
          {/* IF SESSION IS HERE SHOW PROFILE MENU */}
          {/* OTHERWISE SHOW LOGIN BUTTON */}
          {session ? (
            <ProfileMenu
              // IT IS IMPORTANT TO PASS ID
              profileId={profileId || ""}
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
              // className={butt}
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

# OK, LET'S DEFINE `/profile/[id]` PAGE, AND WE ARE GOING TO USE `getServerSideProps` 

AS YOU CAN GUESS, THIS PAGE IS DYNAMIC PAGE, AND WE WILL HAVE SERVER SIDE CODE (A RUNTIME CODE, THAT WILL FETC Profile RECORD FOR CURRENT USER)

ALSO, WE WILL BE GETTING SESSION SERVER SIDE, AND WE WILL DEFINE REDIRECT TO THE `/` (WE WILL BE DOING REDIRRECT SERVER SIDE) IF SESSION IS NOT OBTAINED

```
mkdir pages/profile && touch "pages/profile/[id].tsx"
```

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useEffect } from "react";

import { useRouter } from "next/router";

// CONVINIENTLY WE HAVE TYPE GENERATED FOR US
// BUT I DIDN'T USE THEM ALL BECAUSE I COPIED
// TYPES AFTER QUERY
// BY HOVERING OVER RESULT
import type { /*  Profile, User, */ Order } from "@prisma/client";

// WE NEED SESSION
import { getSession, useSession } from "next-auth/client";

// WE NEED PRISMA CLIENT
import prismaClient from "../../lib/prisma";

export interface PropsI {
  profile: {
    id: string;
    addrss: string | null;
    country: string | null;
    city: string | null;
    ordersHistory: Order[];
    postalCode: string | null;
    taxPrice: number | null;
    user: {
      id: string;
      email: string | null;
      name: string | null;
      image: string | null;
    };
  };
}

type paramsType = {
  // SAME NAME AS [id].tsx
  id: string;
};

export const getServerSideProps: GetServerSideProps<PropsI | {}, paramsType> =
  async (ctx) => {
    const { params } = ctx;

    const profileId = params?.id || "";

    // GETTING SESSION
    // SESSION SHOUD HAVE userId
    // BECAUSE WE INSERTED IT THER THROU session CALLLBACK
    // IN NEXT-AUTH CONFIGURATION
    // DON'T FORGET TO PASS REQUST
    // YOU CAN PASS WHOLE CONTEXT IF YOU WANT
    const session = await getSession({ req: ctx.req });

    const headers = ctx.req.headers;

    // LET'S FETCH PROFILE
    // WE CAN DO A JOIN TO GET User RECORD TOGETHER
    // WITH Profile RECORD
    // BECAUSE Profile RECORD HAS A FORAIGN KEY OF User (id)

    const profileWithUser = await prismaClient.profile.findUnique({
      where: {
        id: profileId,
      },
      select: {
        id: true,
        addrss: true,
        country: true,
        city: true,
        ordersHistory: true,
        postalCode: true,
        taxPrice: true,
        // I INCLUDED USER LIKE THIS
        user: {
          select: {
            email: true,
            name: true,
            image: true,
            id: true,
          },
        },
        // I WON'T INCLUDE DATES (FOR Profile OR FOR User)
        // BECAUSE PRISMA RETURNS     Date   OBJECT
        // I CAN'T PASS Date INSTANCES AS PROPS
        // I WOULD NEED TO STRINGIFY THEM
        // AND I DON'T REALLY NEED DATE OBJECTS HERE
      },
      /* include: {
        user: true,
      }, */
    });

    console.log({ profileWithUser, session, headers });

    // LET'S DO REDIRECT IF THERE IS NO PROFILE
    // OR USER ON SESSION DOESN'T MATCH WITH OBTAINED USER

    // IF YOU REMEMBER WE WERE THE ONE TO ATTACH userId ON SESSIN
    // THROUGH CALLBACK IN NEXT-AUTH CONFIGURATION

    if (!profileWithUser) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {
          profile: {},
        },
      };
    }

    if (session?.userId !== profileWithUser.user.id) {
      ctx.res.writeHead(302, { Location: "/" });
      return {
        props: {
          profile: {},
        },
      };
    }

    // console.log(!profileWithUser, session);

    return {
      props: {
        profile: profileWithUser,
      },
    };
  };

const ProfilePage: NP<PropsI> = (props) => {
  // FOR NOW LET'S JUST SHOW STUFF
  // LETS SHOW WHAT IS IN THE PROPS

  const { profile } = props;

  const { query } = useRouter();

  console.log({ props, query });

  return (
    <div>
      🦉
      <br />
      {JSON.stringify({ profile }, null, 2)}
    </div>
  );
};

export default ProfilePage;
```

I STARTED DEV SERVER, I DID A LOGIN, I OPENED PROFILE, AND I CAN SEE THAT DATA OF ONE USER, OR OF ONE PROFILE IS SUCCESSFULY RENDERED AND PRINTED INSIDE PAGE

## NOW I WANT TO DEFINE UI FOR THE `Profile` PAGE, I WANT FORM WHERE USER CAN UPDATE HIS DATA

YES HIS CURRENT DATA WILL BE DISPLAYED IN FORM AS PLACEHOLDING DATA, BUT USER CAN CHANGE HIS DTA AND PRESS ON UPDATE BUTTON TO SEND REQUEST TO THE ENDPOINT WE ARE GOING TO BUILD LATER

```
mkdir components/3_profile_page && touch components/3_profile_page/UpdateProfile.tsx 
```

```tsx

```
