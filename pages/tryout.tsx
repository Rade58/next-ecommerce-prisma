/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { NextPage as NP } from "next";
import { useState } from "react";

import { TextField, InputLabel } from "@material-ui/core";

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
      <form>
        <InputLabel htmlFor="name-field">Name</InputLabel>
        <TextField
          id="name-field"
          label="Name"
          placeholder="Name"
          variant="filled"
        />
        <InputLabel htmlFor="email-field">Email address</InputLabel>
        <TextField
          id="email-field"
          label="email address"
          placeholder="email address"
          variant="filled"
        />
        <InputLabel htmlFor="message-field">Message</InputLabel>
        <TextField
          id="message-field"
          label="Message"
          placeholder="message"
          multiline
          variant="filled"
        />
      </form>
    </main>
  );
};

export default TryOutPage;
