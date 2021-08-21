/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { NextPage as NP } from "next";
import { useState } from "react";

import { FormControl } from "@material-ui/core";

const TryOutPage: NP = () => {
  return (
    <main
      css={css`
        padding-top: 20vh;
        display: flex;
        justify-content: center;
      `}
    >
      <h1>
        This page is only for practicing{" "}
        <a target="_blank" rel="noreferrer" href="https://sendgrid.com/">
          Sendgrid
        </a>
      </h1>
      <form></form>
    </main>
  );
};

export default TryOutPage;
