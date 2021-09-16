/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type {
  FC,
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
import { Fragment, useState, useEffect } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

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
  LocalShipping,
  Payment,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cont: {
      marginTop: "20px",
    },
    link: {
      display: "flex",
    },
    tip: {
      display: "flex",
      color: "#0c4646",
    },
    icon: {
      // "& > *": {
      marginRight: theme.spacing(0.5),
      width: 20,
      height: 20,
      // },
    },
  })
);

const handleClick: MouseEventHandler = (event) => {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
};

const Steps: FC = () => {
  const { asPath, push } = useRouter();

  const classes = useStyles();

  const paths = [
    {
      name: "Shipping",
      path: "/shipping",
      Icon: function Shipp(props: PropsWithChildren<{ className: string }>) {
        return <LocalShipping className={props.className} />;
      },
    },
    {
      name: "Payment",
      path: "/payment",
      Icon: function Pay(props: PropsWithChildren<{ className: string }>) {
        return <Payment className={props.className} />;
      },
    },
    {
      name: "Place Order",
      path: "/place-order",
      Icon: function Grain(props: PropsWithChildren<{ className: string }>) {
        return <GrainIcon className={props.className} />;
      },
    },
  ];

  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(true);
  }, [setCanRender]);

  return (
    <Fragment>
      {canRender && (
        <Breadcrumbs aria-label="breadcrumb" className={classes.cont}>
          {paths.map(({ path, name, Icon }, i) => {
            return (
              <Fragment key={`${name}-${i}`}>
                {path !== asPath ? (
                  <Link href={path} passHref>
                    <MuLink
                      color="inherit"
                      // onClick={handleClick}
                      className={classes.link}
                    >
                      <Icon className={classes.icon} />
                      {name}
                    </MuLink>
                  </Link>
                ) : (
                  <Typography className={classes.tip}>
                    <Icon className={classes.icon} />
                    {name}
                  </Typography>
                )}
              </Fragment>
            );
          })}

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
      )}
    </Fragment>
  );
};

export default Steps;
