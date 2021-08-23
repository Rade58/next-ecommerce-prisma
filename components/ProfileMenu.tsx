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

interface ProfileMenuProps {
  name: string | null | undefined;
  email: string | null | undefined;
  profileId: string;
}

const ProfileMenu: FC<ProfileMenuProps> = ({ email, name, profileId }) => {
  const { push } = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!profileId || profileId === "") {
    return null;
  }

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
            // IMPORTANT IS TO PASS PROFILE ID INTO ROUTE
            push(`/profile/${profileId}`);
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
