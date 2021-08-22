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
    <main>
      <h1>
        This page is only for practicing{" "}
        <a target="_blank" rel="noreferrer" href="https://sendgrid.com/">
          Sendgrid
        </a>
      </h1>
      <section
        className="form-holder"
        css={css`
          padding-top: 10vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          align-content: center;

          & div.field {
            margin-top: 10vh;
            display: flex;
            justify-content: center;
          }
        `}
      >
        <form>
          <div className="field">
            <TextField
              id="name-field"
              label="Name"
              placeholder="name"
              variant="filled"
            />
          </div>
          <div className="field">
            <TextField
              id="email-field"
              label="Email address"
              placeholder="email address"
              variant="filled"
            />
          </div>
          <div
            className="field"
            css={css`
              align-self: flex-start;
              width: 48vw;
            `}
          >
            <TextField
              id="message-field"
              placeholder="message"
              multiline
              // variant="filled"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        </form>
      </section>
    </main>
  );
};

export default TryOutPage;
