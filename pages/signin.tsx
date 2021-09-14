/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { NextPage as NP } from "next";
import { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/router";

import type { ChangeEventHandler, FormEvent } from "react";

import { TextField, Button, CircularProgress } from "@material-ui/core";

import { useActor } from "@xstate/react";

import {
  shippingNavService,
  EE as EEE,
  fse as fsee,
} from "../machines/shipping-nav-machine";

// WE ARE GOING TO USE SIGNING IN WITH EMAIL LOGIC LIKE THIS
// AND WE NEED TO CHECK SESSION
import { signIn, useSession } from "next-auth/client";
//
//

import CookieStore from "../lib/cart-cookies";

const SignInPage: NP = () => {
  const { push, asPath } = useRouter();
  const [session, loading] = useSession();

  const [stateSh, dispatchSh] = useActor(shippingNavService);

  useEffect(() => {
    if (session) push("/");
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
        // TRY SIGNING IN
        const resp = signIn("email", { email });

        console.log({ resp });
      } catch (err) {
        setReqStatus("idle");
        //

        console.error(err);
      }
    },
    [email, setReqStatus]
  );

  const buttonDisabled = !email || reqStatus === "pending" ? true : false;

  const [intention, setIntention] = useState<string | undefined>(undefined);

  /* useEffect(() => {
    if (intention) return;

    // console.log(asPath);

    // if (asPath.includes("/veryify-email-info")) return;

    const a = CookieStore.checkShippingNavIntent();

    if (a) {
      setIntention("hello world");
      CookieStore.deleteShippIntent;
      push("/shipping");
    }

    console.log(a);
  }, [push, intention, setIntention]); */

  if (session) {
    return null;
  }

  return (
    <main>
      <h1>Sign In</h1>
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
    </main>
  );
};

export default SignInPage;
