/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment, useEffect } from "react";

import { CircularProgress } from "@material-ui/core";

import Router from "next/router";

// WE CAN IMPORT THE HOOK
import useLoadPaypalScript from "../../hooks/paypal/useLoadPaypalScript";
import axios from "axios";

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

                // WE ARE GOING TO USE
                // actions.order.create
                // THIS HAS NOTHING TO DO WITH OUR ORDER RECORD
                // IN OUR DATBASE

                // YOU CAN SAY THAT WE ARE TRYING TO CREATE ORDER
                // INSIDE PAYPLAS DATBASE

                const paypalOrderId = await actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: amountToBePayed.toFixed(2),
                        currency_code: "USD",
                      },
                    },
                  ],
                });

                // WE RETURN ID OF CREATED PAYPAL ORDER
                return paypalOrderId;
              }}
              onApprove={async (data, actions) => {
                // HERE WE SHOULD DFINE WHAT HAPPENS
                // AFTER PAYMENT WAS SUCCESSFULL
                // WE SHOUD DEFINE UPDATING OF OUR ORDER OBJECT
                // THAT'S AN ORDER OBJECT WE MADE EARLIER IN OUR DATBASE

                // AND WE SHOUD CREATE PaymentResult RECORD

                // OF COURSE WE DO THIS BY HITTING THE ROUTE
                // WE ALREADY MADE BUT WE NEED TO ALTER SOME CODE IN
                // MWNTIONED ROUTE

                // BUT WE MUST CALL capture HERE
                // BY DOING THIS WE ARE CONFIRMING PAYMENT
                // AND WE ARE GETTING SOME DATA IN RETURN
                // WE WILL GET BODY OF THE RESPONSE (I GUESS RESPONSE
                // THAT IS BEING SENT AFTER SUCCESSFULL PAYMENT)
                const details = await actions.order.capture();

                const { id: paymentId, status, update_time } = details;

                // THIS status CAN HAVE THESE VALUES:
                // "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED"
                // IT MAKES SENSE WHY YOU WOULD SAVE THIS TO
                // YOUR DATABASE

                // NOW LETS SEND REQUEST TO OUR API ROUTE

                try {
                  // I AM SANDING "POST" REQUEST
                  // BECAUSE WE ARE GOING TO CREATE PaymentResult
                  // RECORD ALSO, BESIDES UPDATING Order RECORD

                  const { data: d } = await axios.post(
                    `/api/order/pay/${orderId}`,
                    { paymentId, status, update_time }
                  );
                  // WE DIDN'T SEND AUTHORIZATION HEADERS
                  // BECAUSEE WE HAVE (OR NOT) SESSION INSIDE COOKIE
                  // WE ARE GOING TO CHECK FOR SESSION AT BACKEND

                  // WE CAN REFRESH AFTER SUCCESSFUL REQUEST
                  // BUT WE ARE NOT GOING TO DO FULL REFRES
                  // JUST NAVIGATE TO THE SAME PAGE

                  Router.push(`/order/${orderId}`);
                } catch (error) {
                  console.error(error);
                }
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
