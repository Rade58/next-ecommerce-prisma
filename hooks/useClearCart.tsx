/* eslint jsx-a11y/anchor-is-valid: 1 */
import React, { useEffect, useState } from "react";
import type { FC } from "react";

import { useRouter } from "next/router";

import Cookies from "js-cookie";

import CartStore from "../lib/cart-cookies";

import { STORAGE_KEYS } from "../components/7_place_order_page/SummaryList";

const useClearCart = () => {
  //
  //
  //
  //

  return { status: "cleared" };
};

export default useClearCart;
