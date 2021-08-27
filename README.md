# ADMIN UI AND ADMIN LOGIC

***
***

IN ORDER TO DEVELOP THINGS ROUND ADMIN ROLE, YOU CAN ALTER ROLE OF THE SOME USER IN YOUR DATBASE

YOU CAN DEFINE THIS WITH PRISMA STUDIO (`yarn prisma:studio`)

***
***

WE ALLREADY ATTACHED Profile RECORD ON THE session

WE CAN CHECK IF PROFILE (CURRENT USER) IS ADMIN OR JUST A USER, AND FOR THE HEADER, WE CAN RENDER ADDITIONAL BUTTON FOR THE ADMIN IF PROFILE IS ACTUALLY ADMIN

```
touch components/AdminButton.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect } from "react";
import type { FC, MouseEvent } from "react";

import { useRouter } from "next/router";

import { Button, Menu, MenuItem } from "@material-ui/core";

import { ExpandMore } from "@material-ui/icons";

import { signOut } from "next-auth/client";

interface AdminMenuProps {
  isAdmin: boolean;
  profileId: string;
}

const AdminMenu: FC<AdminMenuProps> = ({ isAdmin, profileId }) => {
  const { push, pathname, asPath } = useRouter();
  console.log({ pathname, asPath });
  if (!profileId) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div
      style={{
        borderBottom:
          asPath === `/admin/${profileId}`
            ? "pink 4px solid"
            : "pink 0px solid",
      }}
      css={css`
        margin-right: 2em;

        & > button {
          text-transform: lowercase;
          font-size: 0.96em;
        }
      `}
    >
      <Button
        size="small"
        color="secondary"
        onClick={() => {
          push(`/admin/${profileId}`);
        }}
      >
        <span>Admin</span>
      </Button>
    </div>
  );
};

export default AdminMenu;

```

I HOOKED IT UP COMPONENT ABOVE, INSIDE HEADER AND IT IS BEING CONDITIONALLY RENDERED, DEPENDING IF PROFILE ROLE IS ADMIN OR NOT

WE DON'T WANT TO RENDER THIS BUTTON IF ROLE IS NOT ADMIN

```
code components/Header.tsx
```

```tsx
 {/* IF PROFILE IS WITH ROLE ADMIN WE CAN RENDER THIS BUTTON */}
{session &&
  (session as unknown as any)?.profile?.role === "ADMIN" && (
    <AdminButton
      profileId={profId || ""}
      isAdmin={(session as unknown as any)?.profile?.role === "ADMIN"}
    />
  )}
{/* ------------------------------------------------- */}
```

## I'M NOW GOING TO CREATE ADMIN PAGE, WE ARE GOING TO GET ALL USERS, WE NEED TO DISPLAY USERS (ALSO PRODUCTS AND ORDERS (WE ARE GOING TO USE THAT LATTER)) TO THE ADMIN

```
mkdir pages/admin && touch "pages/admin/[id].tsx"
```

```
mkdir components/4_admin_page && touch components/4_admin_page/Layout.tsx
```

I HOOKED EVERYTHING UP, YOU CAN SEE BU YOURSELF, WHAT I DID

**ONE NICE THING WE CAN DO IS TO USE `getServerSideProps` TO CHECK ROLE ON THE PROFILE, AND IF ROLE IS NOT "ADMIN", WE CAN DO A REDDIRECT**

WE CAN DO REDIRECT TO PROFILE PAGE IF WE TILL HAVE A VALID SESSION, AND TO THE MAIN PAGE, IF THERE IS NO SESSION AT ALL

**BUT ALSO WE ARE GOING TO FETCH ALL USERS AND ALL PRODUCTS AND ALL ORDERS, AND PASS THEM AS PROPS**

**BUT WE NEED TO QUERY FOR PRODUCTS, THAT ARE CREATED BY CURRENT ADMIN USER, ALSO ORDERS WE QUERY NEEDS TO BE ORDERS ONLY FOR PRODUCTS, THAT ADMIN USER HAD CREATED**

BUT WE NEED TO PAY ATTENTION ON: "WHAT IF WE HAVE MILLION USERS"

**WELL BECAUSE OF THAT WE RE GOING TO QUERY FOR ONLY 20 PROFILES INITIALLY (INSIDE `getServerSideProps`)**

AND ON FRONT END WE ARE GOING TO REQUEST 20 MORE BECAUSE WE WILL HAVE PAGINATED LIST

**ON THE BACK END WE WILL `LATTER IMPLEMENT` ROUTE WITH QUERY (`WHERE WE WILL DO CURSOR BASED PAGINATION` [________](https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination))**

ADMIN PAGE:

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
import type { GetServerSideProps, NextPage as NP } from "next";
import { useEffect } from "react";

import { useRouter } from "next/router";

import type { Profile, User, Order } from "@prisma/client";

import { getSession, useSession } from "next-auth/client";

import prismaClient from "../../lib/prisma";

import Layout from "../../components/4_admin_page/Layout";

export interface PropsI {
  profiles: (Profile & {
    user: User;
  })[];
}

type paramsType = {
  // SAME NAME AS [id].tsx
  id: string;
};

export const getServerSideProps: GetServerSideProps<PropsI | {}, paramsType> =
  async (ctx) => {
    // LETS GET SESSION FIRST
    const session = await getSession({ req: ctx.req });

    if (!session) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {},
      };
    }

    const id = ctx.params?.id;

    // LET'S ALSO REDIRECT IF WE HAVE WRONG PROFILE
    if ((session as unknown as any).profile.id !== id) {
      ctx.res.writeHead(302, { Location: "/" });

      return {
        props: {},
      };
    }

    // OBTAIN PROFILE AND CHECK FOR ROLE

    const profile = await prismaClient.profile.findUnique({
      where: {
        id: id || "",
      },
      select: {
        role: true,
      },
    });

    // CHECKING THE ROLE ON PROFILE
    // REDIRECT TO PROFILE PAGE
    if (profile?.role !== "ADMIN") {
      ctx.res.writeHead(302, { Location: `/profile/${id}` });

      return {
        props: {},
      };
    }

    // WE WILL GET USERS FOR NOW AND LATER WHAEN WE FIND OUT HOW TO
    // SEED DATBASE WE WILL QUERY FOR SEEDED DATA
    // SEEDED DAT IS DUMMY DATA WE CAN POPULATE DATBASE WITH
    // SO IT WOULD BE EASER FOR OUR DEVELOPMENT

    // WE ARE GETTING EVERY PROFILE WHICH ROLE IS NOT ADMIN
    // BUT WE ARE GOING TO QUERY User SINCE WE WANT TO ORDER BY

    // MAYBE IT WOULD BE BETTER FOR US TO CREATE RAW QUERY
    // BUT THIS ALSO WORKS

    // BECAUSE WITH RAW QUERIES, DATES ARENT TURNED TO Date
    // AN WE DON'T NEET TO CHERRY PICK LIKE BELLOW

    // ONLY THING WITH ROW QUERIES YOU WOULD LAACK TYPESCCRIPT SUPPORT
    // FOR RESULT

    const profiles = await prismaClient.profile.findMany({
      // WE WILL TAKE ONLY 10 RECORDS
      take: 10,
      //
      where: {
        role: {
          not: "ADMIN",
        },
      },
      select: {
        // I'M EXCLUDING Dates BECAUSE
        // I CAN'T SERIALIZE THEM
        // I CAN'T PSS THEM AS PROPS BEFORE TRANSFORMING THEM TO ISOS STRINGS

        createdAt: false,
        updatedAt: false,

        addrss: true,
        city: true,
        country: true,
        id: true,
        paymentMethod: true,
        postalCode: true,
        role: true,
        taxPrice: true,

        user: {
          select: {
            updatedAt: false,
            createdAt: false,
            email: true,
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        // I DON'T KNOW IS IT GOOD PRACTICE TO ORDER LIKE
        // THIS AND DISPLAY TO USER
        // I'M JUST SHOWING YOU THAT
        // YOU CAN USE THIS
        // AND LATTER WHEN I SHOW YOU PAGINATION
        // WE ARE GOING TO USE THIS KIND OF ORDERING TOO
        createdAt: "desc",
      },
    });

    console.log({ profiles });

    // FOR NOW, WE WILL ONLY RETURN USER AND PROFILE
    // AND LATER LIKE I SAID, WE ARE GOING TO PASS
    // PRODUCTS AND ORDERS TOO
    return {
      props: {
        profiles,
      },
    };
  };

const AdminPage: NP<PropsI> = (props) => {
  const { query } = useRouter();

  console.log({ props, query });

  return (
    <Layout>
      <h1>Admin page</h1>
    </Layout>
  );
};

export default AdminPage;
```

# LETS BUILD A UI WITH TABS, BECAUSE WE NEED ONE TAB FOR LISTING OUT PROFILES, AND OTHER TABS FOR ORDERS AND PRODUCTS

```
touch components/4_admin_page/TabsView.tsx
```

```tsx
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, Fragment } from "react";
import type { FC } from "react";

import { useSession } from "next-auth/client";

import { Paper, Tabs, Tab, Typography, Box } from "@material-ui/core";

interface TabPanelPropsI {
  children?: React.ReactNode;
  index: any;
  value: any;
}

const TabPanel: FC<TabPanelPropsI> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabViewsCompPropsI {
  placeholder?: any;
}

const TabsView: FC<TabViewsCompPropsI> = () => {
  const [session, loading] = useSession();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <h1
        css={css`
          align-self: flex-start;
          font-size: 1.36em;
          font-weight: 400;

          margin-bottom: 28px;
        `}
      >
        👩‍💻 admin: {session?.user?.name || session?.user?.email}
      </h1>
      <div
        css={css`
          width: fit-content;
        `}
      >
        <Paper square className="tabs-region">
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Products" {...a11yProps(1)} />
            <Tab label="Orders" {...a11yProps(2)} />
          </Tabs>
        </Paper>
      </div>
      <div
        css={css`
          margin-top: 8px;
          width: 100%;
        `}
      >
        <Paper variant="outlined">
          <TabPanel value={value} index={0}>
            Users
          </TabPanel>
          <TabPanel value={value} index={1}>
            Products
          </TabPanel>
          <TabPanel value={value} index={2}>
            Orders
          </TabPanel>
        </Paper>
      </div>
    </Fragment>
  );
};

export default TabsView;

```

ABOVE COMPONENT I HOOKED IT UP IN LAYOUT, AND IT LOOKS PRETTY

## IN NEXT BRANCH I AM GOING TO BUILD OUT  MULTIPLE ROUTES WHICH ARE GOING BE INTENDED FOR ADMIN TO HIT WHEN HE WANTS TO UPDATE, OR DELETE USER RECORD

OR I CAN REALLY BUILD ROUTES THAT CAN BE USED WITH ALL TYPES OF RECORDS

FOR PRODUCT, USER AND ORDER

