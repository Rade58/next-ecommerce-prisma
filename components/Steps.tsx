/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC, MouseEvent, MouseEventHandler } from "react";
// import  {  } from "react";

import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Breadcrumbs,
  Link as MuLink,
} from "@material-ui/core";

import {
  Home as HomeIcon,
  Whatshot as WhatshotIcon,
  GrainRounded as GrainIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      display: "flex",
    },
    icon: {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
    },
  })
);

const handleClick: MouseEventHandler = (event) => {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
};

const Steps: FC = () => {
  const classes = useStyles();

  const paths = [
    { name: "Shipping", path: "/shipping" },
    { name: "Payment", path: "/payment" },
    { name: "Place Order", path: "/place-order" },
  ];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {/* 
      <MuLink
        color="inherit"
        href="/"
        onClick={handleClick}
        className={classes.link}
      >
        <HomeIcon className={classes.icon} />
        Material-UI
      </MuLink>
      <MuLink
        color="inherit"
        href="/getting-started/installation/"
        onClick={handleClick}
        className={classes.link}
      >
        <WhatshotIcon className={classes.icon} />
        Core
      </MuLink>
      <Typography color="textPrimary" className={classes.link}>
        <GrainIcon className={classes.icon} />
        Breadcrumb
      </Typography> */}
    </Breadcrumbs>
  );
};

export default Steps;
