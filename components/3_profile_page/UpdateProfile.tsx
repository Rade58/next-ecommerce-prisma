/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC, ChangeEventHandler, FormEvent } from "react";
import { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/router";

import { useSession } from "next-auth/client";

import { TextField, Button, CircularProgress } from "@material-ui/core";

import axios from "axios";

interface UpdateProfilePropsI {
  id: string;
  addrss: string;
  country: string;
  city: string;
  postalCode: string;
  taxPrice: number;
  //
  name: string;
}

const UpdateProfile: FC<UpdateProfilePropsI> = (props) => {
  const {
    id: profileId,
    country,
    city,
    addrss,
    postalCode,
    taxPrice,
    name,
  } = props;

  type inputDataKeyType =
    | "addrss"
    | "country"
    | "city"
    | "postalCode"
    | "taxPrice"
    | "name";

  const [inputData, setInputData] = useState<Record<inputDataKeyType, any>>({
    name,
    country,
    city,
    postalCode,
    addrss,
    taxPrice,
  });

  console.log({ inputData });

  const { push } = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (loading) return;

    if (!session) push("/");
  }, [session, loading, push]);

  const [somethingChanged, setSomethingChanged] = useState<boolean>(false);
  const [reqStatus, setReqStatus] = useState<"idle" | "pending">("idle");

  useEffect(() => {
    for (let key in inputData) {
      key = key as inputDataKeyType;

      // @ts-ignore
      if (inputData[key] !== props[key]) {
        setSomethingChanged(true);
      }
    }
  }, [inputData, setSomethingChanged, props]);

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setInputData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setReqStatus("pending");
      try {
        // WE DON'T HAVE API ROUTE YET BUT WE WILL DEFINE A
        // REQUEST

        const { data } = await axios.post(
          `/api/profile/${profileId}`,
          inputData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log({ data });

        setReqStatus("idle");
      } catch (err) {
        setReqStatus("idle");
        //

        console.error(err);
      }
    },
    [inputData, setReqStatus, profileId]
  );

  let submitButtonDisabled = somethingChanged ? false : true;

  submitButtonDisabled = reqStatus === "pending" ? true : submitButtonDisabled;

  console.log({ submitButtonDisabled, reqStatus, somethingChanged });

  if (loading) {
    return (
      <div>
        <CircularProgress color="primary" size={28} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <section
      className="form-holder"
      css={css`
        padding-top: 10vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;

        & div.email-field {
          margin-top: 10vh;
          display: flex;
          justify-content: center;
        }

        & button {
          margin-top: 8vh;
        }
      `}
    >
      <form onSubmit={handleSubmit}>
        <div className="name-field">
          <TextField
            onChange={handleChange}
            value={inputData.name}
            type="text"
            name="name"
            id="name-field"
            label="Display Name"
            placeholder={inputData.name}
            variant="filled"
          />
        </div>
        <div className="country-field">
          <TextField
            onChange={handleChange}
            value={inputData.country}
            type="text"
            name="country"
            id="country-field"
            label="Country"
            placeholder={inputData.country}
            variant="filled"
          />
        </div>
        <div className="city-field">
          <TextField
            onChange={handleChange}
            value={inputData.city}
            type="text"
            name="city"
            id="city-field"
            label="City"
            placeholder={inputData.city}
            variant="filled"
          />
        </div>
        <div className="postalcode-field">
          <TextField
            onChange={handleChange}
            value={inputData.postalCode}
            type="text"
            name="postalCode"
            id="postalcode-field"
            label="Postal Code"
            placeholder={inputData.postalCode}
            variant="filled"
          />
        </div>
        <div className="address-field">
          <TextField
            onChange={handleChange}
            value={inputData.addrss}
            type="text"
            name="addrss"
            id="address-field"
            label="Address"
            placeholder={inputData.addrss}
            variant="filled"
          />
        </div>
        <div className="taxprice-field">
          <TextField
            onChange={handleChange}
            value={inputData.taxPrice}
            type="number"
            name="taxPrice"
            id="taxprice-field"
            label="Tax Price"
            placeholder={inputData.taxPrice}
            variant="filled"
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={submitButtonDisabled}
        >
          {"Update"}
          {reqStatus === "pending" ? (
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
      </form>
    </section>
  );
};

export default UpdateProfile;
