import Cookies from "js-cookie";

const CART = "cart";

interface ItemIn {
  productId: string;
  amount: number;
}

type CartRecord = Record<string, ItemIn>;

export const setCartItem = ({ amount, productId }: ItemIn) => {
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

export const removeCartItem = (productId: string) => {
  const prevCartString = Cookies.get(CART);

  if (!prevCartString) {
    Cookies.set(CART, JSON.stringify({}));

    return {};
  }

  const prevCart = JSON.parse(prevCartString);

  if (!prevCart[productId]) {
    Cookies.set(CART, JSON.stringify(prevCart));

    return prevCart;
  }

  delete prevCart[productId];

  Cookies.set(CART, JSON.stringify(prevCart));

  return prevCart;
};
