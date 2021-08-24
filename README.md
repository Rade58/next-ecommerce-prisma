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
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC, ChangeEventHandler, FormEvent } from "react";
import { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/router";

import { useSession } from "next-auth/client";

import { TextField, Button, CircularProgress } from "@material-ui/core";

import axios from "axios";

interface UpdateProfilePropsI {
  id: string;
  addrss: string;
  country: string;
  city: string;
  postalCode: string;
  taxPrice: number;
  //
  name: string;
}

const UpdateProfile: FC<UpdateProfilePropsI> = (props) => {
  const {
    id: profileId,
    country,
    city,
    addrss,
    postalCode,
    taxPrice,
    name,
  } = props;

  type inputDataKeyType =
    | "addrss"
    | "country"
    | "city"
    | "postalCode"
    | "taxPrice"
    | "name";

  const [inputData, setInputData] = useState<Record<inputDataKeyType, any>>({
    name,
    country,
    city,
    postalCode,
    addrss,
    taxPrice,
  });

  console.log({ inputData });

  const { push } = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (loading) return;

    if (!session) push("/");
  }, [session, loading, push]);

  const [somethingChanged, setSomethingChanged] = useState<boolean>(false);
  const [reqStatus, setReqStatus] = useState<"idle" | "pending">("idle");

  useEffect(() => {
    for (let key in inputData) {
      key = key as inputDataKeyType;

      // @ts-ignore
      if (inputData[key] !== props[key]) {
        setSomethingChanged(true);
      }
    }
  }, [inputData, setSomethingChanged, props]);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setReqStatus("pending");
      try {
        // WE DON'T HAVE API ROUTE YET BUT WE WILL DEFINE A
        // REQUEST

        const { data } = await axios.post(
          `/api/profile/${profileId}`,
          inputData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log({ data });
      } catch (err) {
        setReqStatus("idle");
        //

        console.error(err);
      }
    },
    [inputData, setReqStatus, profileId]
  );

  const submitButtonDisabled =
    reqStatus === "pending" || somethingChanged ? false : true;

  console.log({ submitButtonDisabled, reqStatus, somethingChanged });

  if (loading) {
    return (
      <div>
        <CircularProgress color="primary" size={28} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section
      className="form-holder"
      css={css`
        padding-top: 10vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;

        & div.email-field {
          margin-top: 10vh;
          display: flex;
          justify-content: center;
        }

        & button {
          margin-top: 8vh;
        }
      `}
    >
      <form onSubmit={handleSubmit}>
        <div className="name-field">
          <TextField
            onChange={handleChange}
            value={inputData.name}
            type="text"
            name="name"
            id="name-field"
            label="Display Name"
            placeholder={inputData.name}
            variant="filled"
          />
        </div>
        <div className="country-field">
          <TextField
            onChange={handleChange}
            value={inputData.country}
            type="text"
            name="country"
            id="country-field"
            label="Country"
            placeholder={inputData.country}
            variant="filled"
          />
        </div>
        <div className="city-field">
          <TextField
            onChange={handleChange}
            value={inputData.city}
            type="text"
            name="city"
            id="city-field"
            label="City"
            placeholder={inputData.city}
            variant="filled"
          />
        </div>
        <div className="postalcode-field">
          <TextField
            onChange={handleChange}
            value={inputData.postalCode}
            type="text"
            name="postalCode"
            id="postalcode-field"
            label="Postal Code"
            placeholder={inputData.postalCode}
            variant="filled"
          />
        </div>
        <div className="address-field">
          <TextField
            onChange={handleChange}
            value={inputData.addrss}
            type="text"
            name="addrss"
            id="address-field"
            label="Address"
            placeholder={inputData.addrss}
            variant="filled"
          />
        </div>
        <div className="taxprice-field">
          <TextField
            onChange={handleChange}
            value={inputData.taxPrice}
            type="number"
            name="taxPrice"
            id="taxprice-field"
            label="Tax Price"
            placeholder={inputData.taxPrice}
            variant="filled"
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={submitButtonDisabled}
        >
          {"Update"}
          {reqStatus === "pending" ? (
            <div
              css={css`
                display: inline-block;
                margin-left: 8px;
              `}
            >
              <CircularProgress color="primary" size={18} />
            </div>
          ) : (
            ""
          )}
        </Button>
      </form>
    </section>
  );
};

export default UpdateProfile;
```

**I ALSO BUILD A LAYOUT COMPONENT FOR PROFILE PAGE, AND I NESTED UPPER COMPONENT INTO LAYOUT, AND I RETURNED LAYOUT FROM PROFILE PAGE**

EVERYTHING SEEMS TO WORK AS I EXPECTED

# LETS BUILT A ROUTE THAT WILL UPDATE CURRENT Profile AND CURRENT User RECORD

```
mkdir pages/api/profile && touch "pages/api/profile/[id].ts"
```

```ts

```