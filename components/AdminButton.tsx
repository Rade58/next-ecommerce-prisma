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
  const { push, pathname } = useRouter();

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
          pathname === `/admin/${profileId}`
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
