import Cookies from "js-cookie";

import type { Product } from "@prisma/client";

import { afterDate, elapsed } from "../date";

const CART = "cart";
const EXP_TIME = "EXP_TIME";

export interface ItemIn {
  productId: string;
  amount: number;
  countInStock: number;
  price: number;
  product: Product;
}

export type CartRecord = Record<string, ItemIn>;

const setCartItem = ({
  productId,
  countInStock,
  price,
  amount,
  product,
}: ItemIn) => {
  const prevCartString = Cookies.get(CART);

  if (!prevCartString) {
    Cookies.set(
      CART,
      JSON.stringify({
        [productId]: {
          productId,
          amount,
          countInStock,
          price,
          product,
        },
      })
    );

    return {
      [productId]: { productId, amount, countInStock, price, product },
    } as CartRecord;
  }

  if (!Object.keys(JSON.parse(prevCartString))) {
    Cookies.set(
      CART,
      JSON.stringify({
        [productId]: {
          productId,
          amount,
          countInStock,
          price,
          product,
        },
      })
    );

    return {
      [productId]: { productId, amount, countInStock, price, product },
    } as CartRecord;
  }

  const prevCart = JSON.parse(prevCartString);

  prevCart[productId] = { productId, amount, countInStock, price, product };

  console.log({ prevCart });

  Cookies.set(CART, JSON.stringify(prevCart));

  return prevCart as CartRecord;
};

const clearProduct = (productId: string) => {
  const prevCartString = Cookies.get(CART);

  if (prevCartString === undefined) {
    Cookies.set(CART, JSON.stringify({}));
  }

  const cartString = prevCartString || "";

  const prevCart = JSON.parse(cartString);

  if (!prevCart[productId]) {
    Cookies.set(CART, JSON.stringify(prevCart));

    return prevCart as CartRecord;
  }

  delete prevCart[productId];

  Cookies.set(CART, JSON.stringify(prevCart));

  return prevCart as CartRecord;
};

const clearCart = () => {
  Cookies.set(CART, JSON.stringify({}));

  return {};
};

const getCart = () => {
  const cartString = Cookies.get(CART);

  // console.log({ cartString });

  if (!cartString) {
    Cookies.set(CART, JSON.stringify({}));

    return {};
  }

  if (!Object.keys(JSON.parse(cartString))) {
    Cookies.set(CART, JSON.stringify({}));

    return {};
  }

  return JSON.parse(cartString) as CartRecord;
};

const setExpirationTime = (milisecs: number) => {
  const futureDate = afterDate(milisecs);

  Cookies.set(EXP_TIME, futureDate.toISOString());
};

const timeExpired = () => {
  const timestring = Cookies.get(EXP_TIME);

  debugger;
  if (!timestring) {
    debugger;
    return false;
  }

  return elapsed(new Date(timestring));
};

const clearTimer = () => {
  Cookies.remove(EXP_TIME);
};

const CartStore = {
  setCartItem,
  clearProduct,
  clearCart,
  getCart,
  //
  setExpirationTime,
  timeExpired,
  clearTimer,
};

export default CartStore;
