/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, useCallback, Fragment } from "react";
import type { FC } from "react";

import { useRouter } from "next/router";

import { useSession } from "next-auth/client";

import Link from "next/link";

import axios from "axios";

import type { Profile, Order } from "@prisma/client";

import {
  makeStyles,
  Theme,
  createStyles,
  ListSubheader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Link as MuLink,
  Button,
  CircularProgress,
} from "@material-ui/core";

import {
  ExpandLess,
  ExpandMore,
  StarBorder,
  LocalShippingRounded,
  PaymentRounded,
  ShoppingBasket,
} from "@material-ui/icons";

import Cookies from "js-cookie";

import { SHIPPING_DATA } from "../5_shipping_page/ShippingForm";
import { PAYMENT_METHOD } from "../6_payment_page/PaymentForm";
import CartStore from "../../lib/cart-cookies";
import type { CartRecord } from "../../lib/cart-cookies";

import type { PropsI } from "../../pages/order/[orderId]";

const TAX_PRICE_KEY = "TAX_PRICE_KEY";
const SHIPPING_PRICE_KEY = "SHIPPING_PRICE_KEY";
const TOTAL_PRICE_KEY = "TOTAL_PRICE_KEY";

const TAX_PRICE = 15; // PERCENTS
const SHIPPING_PRICE = 10.99;

export const STORAGE_KEYS = {
  SHIPPING_DATA: SHIPPING_DATA,
  PAYMENT_METHOD: PAYMENT_METHOD,
  TAX_PRICE_KEY,
  SHIPPING_PRICE_KEY,
  TOTAL_PRICE_KEY,
  EXP_TIME: "EXP_TIME",
};

interface ShippingInfoI {
  address: string;
  city: string;
  country: string;
  fullName: string;
  postalCode: string;
}

export interface BodyDataI {
  buyerId: string;
  cart: CartRecord;
  taxPrice: number;
  shippingPrice: number;
  paymentMethod: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      marginTop: "10vh",
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const SummaryList: FC<{
  order: PropsI["order"];
}> = ({ order }) => {
  const [session, loading] = useSession();

  const { push } = useRouter();

  const [placingOrderReqStatus, setPlacingOrderReqStatus] = useState<
    "pending" | "failed" | "idle"
  >("idle");

  const classes = useStyles();
  const [shOpen, setShOpen] = useState(true);
  const [paOpen, setPaOpen] = useState(true);
  const [prOpen, setPrOpen] = useState(true);
  const handleShClick = () => {
    setShOpen(!shOpen);
  };
  const handlePaClick = () => {
    setPaOpen(!paOpen);
  };
  const handlePrClick = () => {
    setPrOpen(!prOpen);
  };

  // const [order, setOrder] = useState<Order | null>(null);

  const handlePaying = useCallback(async () => {
    if (!session) return;

    const profile = session.profile as Profile;

    if (!profile) return;

    try {
      setPlacingOrderReqStatus("pending");

      // const { data: order } = await axios.post(`/api/order`, body);

      // console.log({ order });

      setPlacingOrderReqStatus("idle");
    } catch (error) {
      setPlacingOrderReqStatus("failed");

      setTimeout(() => {
        setPlacingOrderReqStatus("idle");
      }, 2000);
    }

    console.log("placing order");
  }, [setPlacingOrderReqStatus, session]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const total = order.totalPrice;

  const toto = formatter.format(total || 0);

  const buttonDisabled = !total || placingOrderReqStatus !== "idle";

  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(true);
  }, [setCanRender]);

  if (!session) {
    return null;
  }

  const profile = session.profile as Profile;

  const shippingInfo = {
    addrss: profile.addrss,
    city: profile.city,
    country: profile.country,
    postalCode: profile.postalCode,
    name: session?.user?.name,
  };
  const shippingKeys = Object.keys(shippingInfo);

  const paymentMethod = order.paymentMethod;

  return (
    <Fragment>
      {canRender && (
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Order Summary
            </ListSubheader>
          }
          className={classes.root}
        >
          <ListItem button onClick={handleShClick}>
            <ListItemIcon>
              <LocalShippingRounded />
            </ListItemIcon>
            <ListItemText primary="Shipping Info" />
            {shOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={shOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {shippingKeys.map((key) => {
                return (
                  <ListItem key={key} className={classes.nested}>
                    <ListItemText
                      primary={
                        <div
                          css={css`
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: wrap;

                            & .sp1 {
                              color: black;
                            }

                            & .sp2 {
                              color: #2b125a;
                              font-size: 1.1em;
                            }
                          `}
                        >
                          <span className="sp1">{key}:</span>
                          <span className="sp2">
                            {/* @ts-ignore */}
                            {shippingInfo[key]}
                          </span>
                        </div>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
          <ListItem button onClick={handlePaClick}>
            <ListItemIcon>
              <PaymentRounded />
            </ListItemIcon>
            <ListItemText primary="Payment Method" />
            {paOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={paOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem className={classes.nested}>
                <ListItemText primary={paymentMethod} />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handlePrClick}>
            <ListItemIcon>
              <ShoppingBasket />
            </ListItemIcon>
            <ListItemText primary="Cart" />
            {prOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={prOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding></List>
          </Collapse>
        </List>
      )}
      <div
        css={css`
          display: flex;
          flex-direction: column;
          margin: 20px 5px;

          & div {
            display: flex;
            justify-content: space-between;
            width: 200px;
          }
        `}
      >
        <div className="ship-pr">
          <span>Shippment cost:</span>
          <span>{formatter.format(SHIPPING_PRICE)}</span>
        </div>
        <div className="tax-pr">
          <span>Tax price:</span>
          <span>{TAX_PRICE}%</span>
        </div>
      </div>
      <span
        css={css`
          margin-top: 18px;
          font-size: 1.2em;
          font-weight: 600;
        `}
      >
        total:
      </span>
      <h2>{toto}</h2>
      {placingOrderReqStatus !== "failed" && (
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={buttonDisabled}
          onClick={() => {
            handlePaying();
          }}
        >
          {/* WE ARE SAYING CONTINUE
            BUT BECAUSE THIS BUTTON SHOUD DIRECT US
            TO CHECKOUT PAGE */}
          {"Place Order "}
          {placingOrderReqStatus !== "idle" ? (
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
      )}
      {placingOrderReqStatus === "failed" ? (
        <div
          css={css`
            color: tomato;
          `}
        >
          Something went wrong
        </div>
      ) : null}
    </Fragment>
  );
};

export default SummaryList;
