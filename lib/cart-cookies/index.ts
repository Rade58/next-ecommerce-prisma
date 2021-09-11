import Cookies from "js-cookie";

import { afterDate, elapsed } from "../date";

const CART = "cart";
const EXP_TIME = "EXP_TIME";

export interface ItemIn {
  productId: string;
  amount: number;
  countInStock: number;
  price: number;
}

export type CartRecord = Record<string, ItemIn>;

const setCartItem = ({ amount, productId, countInStock, price }: ItemIn) => {
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
        },
      })
    );

    return {
      [productId]: { productId, amount, countInStock, price },
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
        },
      })
    );

    return {
      [productId]: { productId, amount, countInStock, price },
    } as CartRecord;
  }

  const prevCart = JSON.parse(prevCartString);

  prevCart[productId] = { productId, amount, countInStock, price };

  console.log({ prevCart });

  Cookies.set(CART, JSON.stringify(prevCart));

  return prevCart as CartRecord;
};

const removeCartItem = (productId: string) => {
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

  console.log({ cartString });

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

  Cookies.set(EXP_TIME, futureDate.toLocaleDateString());
};

const timeExpired = () => {
  const timestring = Cookies.get(EXP_TIME);

  if (!timestring) {
    return false;
  }

  return elapsed(new Date(timestring));
};

const clearTimer = () => {
  Cookies.remove(EXP_TIME);
};

const CartStore = {
  setCartItem,
  removeCartItem,
  clearCart,
  getCart,
  //
  setExpirationTime,
  timeExpired,
  clearTimer,
};

export default CartStore;
