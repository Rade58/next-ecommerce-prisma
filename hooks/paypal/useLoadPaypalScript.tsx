/* eslint jsx-a11y/anchor-is-valid: 1 */
import React, { useCallback } from "react";
import type { FC } from "react";

import axios from "axios";

// THIS PACKAGE HAS A HOOK THAT WILL ALLOW US TO USE REDUCER
import {
  usePayPalScriptReducer,
  // AMONG OTHER THINGS IT ALSO HAS THIS PACKAGE THAT PROVIDE US
  // WITH A COMPONENTS FOR THE BUTTONS
  PayPalButtons,
} from "@paypal/react-paypal-js";

const useLoadPaypalScript = () => {
  // WE WILL CREATE ASYNC FUNCTION

  const loadPypalScript = useCallback(async () => {
    // FIRST WE HIT THE ROUTE
    // WE DON'T NEED TO SEN OUR SESSION
    // BECAUSE IT IS SENT WITH EVERY REQ SINCE ITS A PART OF COOKIE
    // HEADER, TLEAST I THINK IT IS
  }, []);
};

export default useLoadPaypalScript;
