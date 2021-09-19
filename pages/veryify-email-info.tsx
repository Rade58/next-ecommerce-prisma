/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { NextPage as NP } from "next";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/client";

const VerifyEmailInfoPage: NP = () => {
  const { push } = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (session) push("/");
  }, [session, push]);

  if (session) {
    return null;
  }

  return (
    <section
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
      <h2>Check your email.</h2>
      <h3>A sign in link has been sent to your email address.</h3>
    </section>
  );
};

export default VerifyEmailInfoPage;
