/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useEffect } from "react";

import { CircularProgress } from "@material-ui/core";

// WE CAN IMPORT THE HOOK
import useLoadPaypalScript from "../../hooks/paypal/useLoadPaypalScript";

interface PropsI {
  orderPayed: boolean;
  orderId: string;
  amountToBePayed: number;
}

const PayPalStuff: FC<PropsI> = ({ orderPayed, amountToBePayed, orderId }) => {
  console.log({ orderPayed, amountToBePayed, orderId });

  const { PayPalButtons, isPending, loadPypalScript } = useLoadPaypalScript();

  // INSIDE EFFECT WE WILL LOAD PAYPAL SCRIP
  // BUT ONLY IF ORDER ISN'T PAYED FOR

  useEffect(() => {
    if (!orderPayed) {
      loadPypalScript();
    }
  }, [orderPayed, loadPypalScript]);

  return (
    <Fragment>
      {!orderPayed && (
        <div className="paypal-buttons">
          {!isPending ? (
            <PayPalButtons
              createOrder={async (__, actions) => {
                // HERE WE ARE GOING TO DEFINE HOW MUCH WE CHARGE THE
                // THE USERS CARD
                return "";
              }}
              onApprove={async (data, actions) => {
                // HERE WE SHOULD DFINE WHAT HAPPENS
                // AFTER PAYMENT WAS SUCCESSFULL
                // WE SHOUD DEFINE UPDATING OF ORDER OBJECT IN HERE
                // OF COURSE WE DO THIS BY HITTING THE ROUTE
                return;
              }}
              onError={(error) => {
                console.error(error);

                // WE SHOULD NAVIGATE MAYBE TO ERROR PAGE
                // WE SHOULD BUILT IN CASE PAYPAL FAILS
              }}
            />
          ) : (
            <CircularProgress size={20} color="primary" />
          )}
        </div>
      )}
    </Fragment>
  );
};

export default PayPalStuff;
