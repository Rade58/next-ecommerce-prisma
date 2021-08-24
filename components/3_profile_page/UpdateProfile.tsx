/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC, ChangeEventHandler, FormEvent } from "react";
import { useEffect, useState, useCallback } from "react";

import { useRouter } from "next/router";

import { useSession } from "next-auth/client";

import { TextField, Button, CircularProgress } from "@material-ui/core";

interface UpdateProfilePropsI {
  id: string;
  addrss: string | null;
  country: string | null;
  city: string | null;
  postalCode: string | null;
  taxPrice: number | null;
  //
  name: string | null;
}

const UpdateProfile: FC<UpdateProfilePropsI> = (props) => {
  const { id, country, city, addrss, postalCode, taxPrice, name } = props;

  const inputData = useState<{
    addrss: string;
    country: string;
    city: string;
    postalCode: string;
    taxPrice: number;
    //
    name: string;
  }>({
    name: name || "",
    country: country || "",
    city: city || "",
    postalCode: postalCode || "",
    addrss: addrss || "",
    taxPrice: taxPrice || 0,
  });

  const { push } = useRouter();

  const [session, loading] = useSession();

  useEffect(() => {
    if (!session) push("/");
  }, [session, push]);

  const [{ email }, setFields] = useState<{
    email: string;
  }>({
    email: "",
  });

  const [reqStatus, setReqStatus] = useState<"idle" | "pending">("idle");

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setReqStatus("pending");
      try {
        //
        // REQUEST

        console.log({});
      } catch (err) {
        setReqStatus("idle");
        //

        console.error(err);
      }
    },
    [email, setReqStatus]
  );

  const buttonDisabled = reqStatus === "pending" ? true : false;

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
        <div className="email-field">
          <TextField
            onChange={handleChange}
            value={email}
            type="email"
            name="email"
            id="email-field"
            label="Sign In/Up With Email"
            placeholder="Sign In/Up With Email"
            variant="filled"
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={buttonDisabled}
        >
          {"Sign In/Up "}
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
