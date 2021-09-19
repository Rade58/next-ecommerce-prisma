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
  DISPATCH_ACTION,
  SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";

const useLoadPaypalScript = () => {
  // LETS USE PAYPALS REDUCER
  // ON THIS OBJECT WE HAVE SOME HELPFUL BOOLEANS
  // WE ARE GOING TO USE JUST isPending
  const [__, paypalDispatch] = usePayPalScriptReducer();

  const { isPending, options } = __;

  // WE WILL CREATE ASYNC FUNCTION

  const loadPypalScript = useCallback(async () => {
    // FIRST WE HIT THE ROUTE

    // WE DON'T NEED TO SEN OUR SESSION
    // BECAUSE IT IS SENT WITH EVERY REQ SINCE ITS A PART OF COOKIE
    // HEADER, TLEAST I THINK IT IS

    // LIKE I SAID SESSION WILL BE IN THE COOKIE AND I
    // ALREDY DEFINED CHECKING FOR THAT SESSION, ON API ROUTE
    const { data: clientId } = await axios.get("/api/config/paypal");

    if (!clientId || typeof clientId !== "string") {
      throw new Error("paypal client id is invalid");
    }

    // NOW WE ARE DISPATCHING TO THE PAYPAL REDUCE
    // WE WANT TO SAY TO HIM THAT WE GOT CLIENT ID
    // AND THAT IT SHOUD USE OPTIONS WE WILL GIVE IT

    paypalDispatch({
      type: DISPATCH_ACTION.RESET_OPTIONS,
      value: {
        // WE CAN PASS ANY OPTIONS AND OVERWRITE THEM
        // WE DON'T HAVE ANY PREVIOUS OPTIONS
        // BUT WE ARE GOING TO DO SPREAD
        ...options,
        "client-id": clientId,
        // WE WILL SET UP CURRENCY TOO
        currency: "USD",
      },
    });

    // NOW WE ARE SETTING LOADING STATUS
    // BY DOING THIS WE ARE LOADING PAYPAL SCRIPT
    paypalDispatch({
      type: DISPATCH_ACTION.LOADING_STATUS,
      value: SCRIPT_LOADING_STATE.PENDING,
    });
  }, [options, paypalDispatch]);

  // WE WILL RETURN BOOLEAN SO WE CAN DISPLAY LOADER
  // WE CAN RETURN COMPONENT WE WILL DISPLAY
  // AND OFCOURSE, WE ARE GOING TO RETURN UPPER CALLBACK

  // DEPENDING ON IF SCRIPT IS LOADED OR NOT
  // isPending IS GOING TO CHANGE OFCOURSE

  // DURING WHEN isPending IS ACTUALLY true, WE SHOULDD
  // SHOW SOME LOADER, AND WHEN IT IS false WWE CAN SHOW
  // PAYPAL BUTTONS

  return {
    isPending,
    PayPalButtons,
    loadPypalScript,
  };
};

export default useLoadPaypalScript;
