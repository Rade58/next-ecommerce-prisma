/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, useCallback } from "react";
import type { FC } from "react";

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
} from "@material-ui/core";

import {
  ExpandLess,
  ExpandMore,
  StarBorder,
  LocalShippingRounded,
  PaymentRounded,
  Cake,
} from "@material-ui/icons";

import Cookies from "js-cookie";

import { SHIPPING_DATA } from "../5_shipping_page/ShippingForm";
import { PAYMENT_METHOD } from "../6_payment_page/PaymentForm";
import CartStore from "../../lib/cart-cookies";
import type { CartRecord } from "../../lib/cart-cookies";

interface ShippingInfoI {
  address: string;
  city: string;
  country: string;
  fullName: string;
  postalCode: string;
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

const SummaryList: FC = () => {
  const classes = useStyles();
  const [shOpen, setShOpen] = useState(true);
  const [paOpen, setPaOpen] = useState(false);
  const [prOpen, setPrOpen] = useState(false);

  const [cart, setCart] = useState<CartRecord>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoI>({
    address: "",
    city: "",
    country: "",
    fullName: "",
    postalCode: "",
  });

  useEffect(() => {
    setCart(CartStore.getCart());

    const pM = Cookies.get(PAYMENT_METHOD);

    if (pM) {
      setPaymentMethod(pM);
    }

    const sI = Cookies.get(SHIPPING_DATA);

    if (sI) {
      setShippingInfo(JSON.parse(sI) as ShippingInfoI);
    }
  }, [setCart, setPaymentMethod, setShippingInfo]);

  const cartToArr = useCallback(() => {
    const arr = [];

    for (const key in cart) {
      arr.push(cart[key]);
    }

    return arr;
  }, [cart]);

  const shippingKeys = Object.keys(shippingInfo);

  const handleShClick = () => {
    setShOpen(!shOpen);
  };
  const handlePaClick = () => {
    setPaOpen(!paOpen);
  };
  const handlePrClick = () => {
    setPrOpen(!prOpen);
  };

  return (
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
                {/* @ts-ignore */}
                <ListItemText primary={`${key}: ${shippingInfo[key]}`} />
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
          <Cake />
        </ListItemIcon>
        <ListItemText primary="Products" />
        {prOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={prOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {cartToArr().map(({ productId, amount, product: { name } }, i) => {
            return (
              <ListItem
                key={`${i}-${i}-${productId}`}
                className={classes.nested}
              >
                <ListItemText primary={`${amount} x ${name}`} />
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </List>
  );
};

export default SummaryList;
