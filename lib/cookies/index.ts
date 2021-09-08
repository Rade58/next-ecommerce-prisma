import Cookies from "js-cookie";

interface ItemIn {
  productId: string;
  amount: number;
}

type CartRecord = Record<string, ItemIn>;

export const setCartItem = ({ amount, productId }: ItemIn) => {
  const prevCartString = Cookies.get("cart");

  if (!prevCartString) {
    Cookies.set(
      "cart",
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

  Cookies.set("cart", JSON.stringify(prevCart));

  return prevCart as CartRecord;
};
