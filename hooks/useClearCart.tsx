/* eslint jsx-a11y/anchor-is-valid: 1 */
import React, { useEffect, useState } from "react";
import type { FC } from "react";

import { useRouter } from "next/router";

import { useActor } from "@xstate/react";

import Cookies from "js-cookie";

import CartStore from "../lib/cart-cookies";

import { STORAGE_KEYS } from "../components/7_place_order_page/SummaryList";

import { cartService, EE } from "../machines/cart-machine";

const useClearCart = () => {
  const [cleared, setCleared] = useState<boolean>(false);

  const [state, dispatch] = useActor(cartService);

  useEffect(() => {
    CartStore.clearCart();

    dispatch({
      type: EE.CLEAR_CART,
    });

    for (let key in STORAGE_KEYS) {
      Cookies.remove(key);
    }
  }, [setCleared, dispatch]);

  return [cleared];
};

export default useClearCart;
