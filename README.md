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


```





