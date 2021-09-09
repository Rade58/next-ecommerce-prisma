import Cookies from "js-cookie";

const CART = "cart";

export interface ItemIn {
  productId: string;
  amount: number;
}

export type CartRecord = Record<string, ItemIn>;

const setCartItem = ({ amount, productId }: ItemIn) => {
  const prevCartString = Cookies.get(CART);

  if (!prevCartString) {
    Cookies.set(
      CART,
      JSON.stringify({
        [productId]: {
          productId,
          amount,
        },
      })
    );

    return { [productId]: { productId, amount } } as CartRecord;
  }

  const prevCart = JSON.parse(prevCartString);

  prevCart[productId] = { productId, amount };

  Cookies.set(CART, JSON.stringify(prevCart));

  return prevCart as CartRecord;
};

const removeCartItem = (productId: string) => {
  const prevCartString = Cookies.get(CART);

  if (!prevCartString) {
    Cookies.set(CART, JSON.stringify({}));

    return {};
  }

  const prevCart = JSON.parse(prevCartString);

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

  if (!cartString) {
    Cookies.set(CART, {});

    return {};
  }

  return JSON.parse(cartString) as CartRecord;
};

const CartStore = {
  setCartItem,
  removeCartItem,
  clearCart,
  getCart,
};

export default CartStore;
