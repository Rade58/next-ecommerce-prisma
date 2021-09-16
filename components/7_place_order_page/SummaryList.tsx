/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState, useEffect, useCallback, Fragment } from "react";
import type { FC } from "react";

import { useRouter } from "next/router";

import Link from "next/link";

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
};

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
  const { push } = useRouter();

  const [total, setTotal] = useState<number>(0);

  const classes = useStyles();
  const [shOpen, setShOpen] = useState(true);
  const [paOpen, setPaOpen] = useState(true);
  const [prOpen, setPrOpen] = useState(true);

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
    const ca = CartStore.getCart();

    const pM = Cookies.get(PAYMENT_METHOD);

    const sI = Cookies.get(SHIPPING_DATA);

    // IF ANY OF THESE PRAMETERS IS MISSING, WE SHOUD REDDIRECT TO INDEX PAGE
    // I'M NOT GOING TO SHOW ANY INFO TO THE USER
    // BECAUSE I WANT TO END THSI PROJECT AS SOON AS POSSIBLE

    if (ca) {
      setCart(ca);

      if (!Object.keys(ca).length) {
        push("/");
        return;
      }
    }

    if (pM) {
      setPaymentMethod(pM);

      if (!pM.length) {
        push("/");
        return;
      }
    }

    if (sI) {
      setShippingInfo(JSON.parse(sI) as ShippingInfoI);

      if (!Object.keys(JSON.parse(sI) as ShippingInfoI).length) {
        push("/");
        return;
      }
    }
  }, [setCart, setPaymentMethod, setShippingInfo, push]);

  const cartToArr = useCallback(() => {
    const arr = [];

    for (const key in cart) {
      arr.push(cart[key]);
    }

    return arr;
  }, [cart]);

  useEffect(() => {
    let sum = 0;

    for (const key in cart) {
      // DON'T FORGET TO CALCCULATE 15 PERCENTS OF AN PRODUCT PRICE
      // AND ADD IT TO THE PRODUCT PRICE
      const productPrice = cart[key].price;

      const tax = 15 / (100 / productPrice);

      sum =
        sum +
        (cart[key].amount as unknown as number) * productPrice +
        (cart[key].amount as unknown as number) * tax;
    }

    // WE SHOULD ALSO ADD SHIPPING PRICE

    sum = sum + SHIPPING_PRICE;

    setTotal(sum);
  }, [cart, setTotal]);

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

  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(true);
  }, [setCanRender]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // SETTING ALL THE DATA INSIDE COOKIE

  useEffect(() => {
    if (!total) return;

    Cookies.set(TOTAL_PRICE_KEY, total.toFixed(2));
  }, [total]);

  const toto = formatter.format(total);

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
            <List component="div" disablePadding>
              {cartToArr().map(
                ({ productId, amount, product: { name, price } }, i) => {
                  let tot = ((amount as unknown as number) * price).toFixed(2);

                  const formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  });

                  tot = formatter.format(parseFloat(tot));

                  return (
                    <ListItem
                      key={`${i}-${i}-${productId}`}
                      className={classes.nested}
                    >
                      <ListItemText
                        primary={
                          <div
                            css={css`
                              display: flex;
                              justify-content: space-between;
                              flex-wrap: wrap;

                              & .sp1 {
                                color: black;
                                display: flex;
                                font-size: 0.9em;

                                & > sapn {
                                  word-wrap: nowrap;
                                }
                              }

                              & .sp2 {
                                color: #2b125a;
                                font-size: 1em;
                              }

                              & .name-sp {
                                margin-left: 10px;
                                display: inline-block;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 120px;
                                /* border: #cac9c9 solid 1px; */
                                max-height: 1.3em;

                                color: #436497;

                                &:hover {
                                  color: #392d80;
                                  text-decoration-line: underline;
                                }
                              }
                            `}
                          >
                            <span className="sp1">
                              <span>{`${amount} x`}</span>
                              <Link href={`/products/${productId}`} passHref>
                                <MuLink component="button" variant="body2">
                                  <span className="name-sp">{name}</span>
                                </MuLink>
                              </Link>
                            </span>
                            <span className="sp2">{tot}</span>
                          </div>
                        }
                      />
                    </ListItem>
                  );
                }
              )}
            </List>
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
    </Fragment>
  );
};

export default SummaryList;
