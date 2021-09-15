/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type {
  FC,
  ChangeEventHandler,
  FormEvent,
  SyntheticEvent,
  ChangeEvent,
} from "react";
import { useState, Fragment, useCallback, useEffect } from "react";

import axios from "axios";

import { useSession } from "next-auth/client";

import { DataGrid, GridColDef } from "@material-ui/data-grid";
import type {
  GridSelectionModel,
  GridEditRowsModel,
} from "@material-ui/data-grid";

import {
  Card,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  CircularProgress,
  Snackbar,
  IconButton,
  Input,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";

import { DeleteSweep as DelIcon, ExpandMore } from "@material-ui/icons";

import type { AlertProps } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";

import type { Profile } from "@prisma/client";

import Cookies from "js-cookie";

import { useActor } from "@xstate/react";

import { useRouter } from "next/router";
import { cartService, EE } from "../../machines/cart-machine";

export const PAYMENT_METHOD = "PAYMENT_METHOD";

interface PropsI {
  // placeholder?: boolean;
  initialPaymentMethod: string | null;
}

const PaymentForm: FC<PropsI> = (props) => {
  const { push } = useRouter();

  const { initialPaymentMethod } = props;

  const [session, loading] = useSession();

  const [state, dispatch] = useActor(cartService);

  // const [paymentMethod, setPaymentMethod] = useState<string>("PayPal");
  const [paymentMethod, setPaymentMethod] = useState<string>(
    initialPaymentMethod ? initialPaymentMethod : "PayPal"
  );

  const [paymentMethodSetupReqStatus, setPaymentMethodSetupReqStatus] =
    useState<"idle" | "pending" | "rejected">("idle");

  const handleChange: ChangeEventHandler = (event) => {
    setPaymentMethod((event.target as HTMLInputElement).value);
  };

  const handlePaymentMethodSetup = useCallback(async () => {
    // e.preventDefault();

    if (!session) {
      return;
    }

    if (loading) {
      return;
    }

    if (!session.profile || !(session as any).profile.id) {
      return;
    }

    if (!paymentMethod) {
      return;
    }

    try {
      setPaymentMethodSetupReqStatus("pending");
      // throw new Error("Hello world");

      // AS YOU CAN SEE HERE WE ARE MAKING NETWORK REQUEST
      const { data } = await axios.put(
        `/api/pref-payment-method/${(session as any).profile.id}`,
        {
          paymentMethod,
        }
      );

      console.log({ receivedData: data });

      // SAVING PAYMENT DATA TO COOKIE

      Cookies.set(PAYMENT_METHOD, data as string);

      /* const a = JSON.parse(Cookies.get(SHIPPING_DATA));

        console.log({ a }); */

      // setCursor(products[products.length - 1].productId);

      setPaymentMethodSetupReqStatus("idle");

      push("/place-order");

      // console.log({ data });
    } catch (err) {
      setPaymentMethodSetupReqStatus("rejected");
      console.error({ err });
      setTimeout(() => {
        setPaymentMethodSetupReqStatus("idle");
      }, 3000);
    }
  }, [session, loading, setPaymentMethodSetupReqStatus, paymentMethod, push]);

  const buttonDisabled =
    !paymentMethod || paymentMethodSetupReqStatus === "pending" ? true : false;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  return (
    <div className="shipping-form">
      <section
        className="form-holder"
        css={css`
          margin-top: 10vh;

          /* padding-top: 10vh; */
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          align-content: center;

          & div.field {
            /* margin-top: 10vh; */
            display: flex;
            justify-content: center;
            margin-top: 2vh;
          }
          & div.file-input {
            /* margin-top: 10vh; */
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 22px;
          }

          & button {
            margin-top: 8vh;
          }
        `}
      >
        <h2>Payment Method</h2>
        {mounted && (
          <FormControl component="fieldset">
            {/* <FormLabel component="legend">Gender</FormLabel> */}
            <RadioGroup
              aria-label="paayment method"
              name="payment-method"
              value={paymentMethod}
              onChange={handleChange}
            >
              <FormControlLabel
                value="PayPal"
                control={<Radio />}
                label="PayPal"
              />
              {/* <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel
            value="disabled"
              disabled
              control={<Radio />}
              label="(Disabled option)"
            /> */}
            </RadioGroup>
          </FormControl>
        )}
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={buttonDisabled}
          onClick={() => {
            handlePaymentMethodSetup();
          }}
        >
          {/* WE ARE SAYING CONTINUE
            BUT BECAUSE THIS BUTTON SHOUD DIRECT US
            TO CHECKOUT PAGE */}
          {"Continue "}
          {paymentMethodSetupReqStatus === "pending" ||
          paymentMethodSetupReqStatus === "rejected" ? (
            <div
              css={css`
                display: inline-block;
                margin-left: 8px;
              `}
            >
              <CircularProgress color="primary" size={18} />
            </div>
          ) : (
            ""
          )}
        </Button>
        {paymentMethodSetupReqStatus === "rejected" && (
          <span
            css={css`
              color: tomato;
              margin-left: 60px;
              margin-top: 12px;
            `}
          >
            Something went wrong
          </span>
        )}
      </section>
    </div>
  );
};

export default PaymentForm;
