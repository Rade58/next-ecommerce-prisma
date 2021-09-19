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
}

const PayPalStuff: FC<PropsI> = ({ orderPayed }) => {
  console.log({ orderPayed });

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
              createOrder={async (data, actions) => {
                // HERE WE ARE GOING TO DEFINE HOW MUCH WE CHARGE THE
                // THE USERS CARD
                return "";
              }}
              onApprove={async (data, actions) => {
                // HERE WE SHOULD DEFINE NAVIGATION
                // BACK TO OUR ORDER
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
