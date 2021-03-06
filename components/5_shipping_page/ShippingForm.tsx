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

import { useRouter } from "next/router";

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
} from "@material-ui/core";

import { DeleteSweep as DelIcon, ExpandMore } from "@material-ui/icons";

import type { AlertProps } from "@material-ui/lab";
import MuiAlert from "@material-ui/lab/Alert";

import type { Profile } from "@prisma/client";

import Cookies from "js-cookie";

import { useActor } from "@xstate/react";

import { cartService, EE } from "../../machines/cart-machine";

export const SHIPPING_DATA = "SHIPPING_DATA";

interface PropsI {
  fullName: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
}

const ShippingForm: FC<PropsI> = (props) => {
  const { push } = useRouter();

  const [session, loading] = useSession();

  // const [state, dispatch] = useActor(cartService);

  const [shippingUpdateReqStatus, setShippingUpdateReqStatus] = useState<
    "idle" | "pending" | "rejected"
  >("idle");

  const [fields, setFields] = useState<{
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  }>({
    // WE WILL FETCH DATA BUT TEMPORARRY PUT SOMETHING
    address: props.address || "",
    city: props.city || "",
    country: props.country || "",
    fullName: props.fullName || "",
    postalCode: props.postalCode || "",
  });

  const { address, city, country, fullName, postalCode } = fields;

  const handleFieldChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleUpdateShippingData = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!session) {
        return;
      }

      if (loading) {
        return;
      }

      if (!session.profile || !(session as any).profile.id) {
        return;
      }

      try {
        setShippingUpdateReqStatus("pending");
        // throw new Error("Hello world");

        // AS YOU CAN SEE HERE WE ARE MAKING NETWORK REQUEST
        const { data } = await axios.put(
          `/api/shipping/${(session as any).profile.id}`,
          {
            addrss: address,
            city,
            postalCode,
            name: fullName,
            country,
          }
        );

        console.log({ receivedData: data });

        // SAVING SHIPPING DATA TO COOKIE

        Cookies.set(
          SHIPPING_DATA,
          JSON.stringify({
            address,
            city,
            postalCode,
            name: fullName,
            country,
          })
        );

        /* const a = JSON.parse(Cookies.get(SHIPPING_DATA));

        console.log({ a }); */

        // setCursor(products[products.length - 1].productId);
        setFields({
          address: "",
          city: "",
          country: "",
          fullName: "",
          postalCode: "",
        });

        push("/payment");

        setShippingUpdateReqStatus("idle");

        // console.log({ data });
      } catch (err) {
        setShippingUpdateReqStatus("rejected");
        console.error({ err });
        setTimeout(() => {
          setShippingUpdateReqStatus("idle");
        }, 3000);
      }
    },
    [
      session,
      loading,
      address,
      city,
      country,
      fullName,
      postalCode,
      setShippingUpdateReqStatus,
      push,
    ]
  );

  const buttonDisabled =
    !fullName ||
    !address ||
    !city ||
    !country ||
    !postalCode ||
    shippingUpdateReqStatus === "pending"
      ? true
      : false;

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
        <h2>Shipping Info</h2>
        <form onSubmit={handleUpdateShippingData}>
          <div className="field">
            <TextField
              onChange={handleFieldChange}
              value={fullName}
              name="fullName"
              id="fname-field"
              label="Full Name"
              placeholder="Full Name"
              variant="filled"
            />
          </div>
          <div className="field">
            <TextField
              onChange={handleFieldChange}
              value={address}
              name="address"
              id="address-field"
              label="Address"
              placeholder="Address"
              variant="filled"
            />
          </div>
          <div className="field">
            <TextField
              onChange={handleFieldChange}
              value={city}
              name="city"
              id="city-field"
              label="City"
              placeholder="City"
              variant="filled"
            />
          </div>
          <div className="field">
            <TextField
              onChange={handleFieldChange}
              value={country}
              name="country"
              id="country-field"
              label="Country"
              placeholder="Country"
              variant="filled"
            />
          </div>

          <div className="field">
            <TextField
              onChange={handleFieldChange}
              value={postalCode}
              name="postalCode"
              id="postalCode-field"
              label="postalCode"
              placeholder="postalCode"
              variant="filled"
            />
          </div>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={buttonDisabled}
          >
            {/* WE ARE SAYING CONTINUE
            BUT BECAUSE THIS BUTTON SHOUD DIRECT US
            TO CHECKOUT PAGE */}
            {"Continue "}
            {shippingUpdateReqStatus === "pending" ||
            shippingUpdateReqStatus === "rejected" ? (
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
          {shippingUpdateReqStatus === "rejected" && (
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
        </form>
      </section>
    </div>
  );
};

export default ShippingForm;
