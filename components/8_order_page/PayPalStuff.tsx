/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment } from "react";
// WE CAN IMPORT THE HOOK
import useLoadPaypalScript from "../../hooks/paypal/useLoadPaypalScript";

interface PropsI {
  orderPayed: boolean;
}

const PayPalStuff: FC<PropsI> = ({ orderPayed }) => {
  console.log({ orderPayed });

  const { PayPalButtons, isPending, loadPypalScript } = useLoadPaypalScript();

  return (
    <Fragment>
      {!orderPayed && (
        <div className="paypal-buttons">
          <PayPalButtons
            createOrder={async (data, actions) => {
              //
              return "";
            }}
            onApprove={async (data, actions) => {
              //
              return;
            }}
            onError={(error) => {
              console.error(error);
            }}
          />
        </div>
      )}
    </Fragment>
  );
};

export default PayPalStuff;
