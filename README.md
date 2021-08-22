# NEXT-AUTH AUTHENTICATION WITH EMAIL MAGIC LINK, USING REAL EMAIL PROVIDER

I'M GOING TO USE [TWILIO SENDGRID](https://sendgrid.com/)

# BEFORE IMPLEMENTING SENDGRID IN OUR NEXT-AUTH PIPLINE, I WANT TO FIN OUT MORE ABOUT SENDGRID, SO I'M GOING TO PLAY A LITTLE BIT WITH IT

I WANT TO MAKE API ROUTE, WHERE I'M GOING TO IMPLEMENT SENDING MAILS WITH SENDGRID

I WILL FOLLOW [THIS YOUTUBE TUTORIAL](https://www.youtube.com/watch?v=QrVYLLpoyMw)

## LET'S FIRST CREATE SOME TEMPORARRY TEST PAGE, AND ON THE PAGE SOME FORM WITH COUPLE OF FIELDS

SO FAR I CREATED THIS

```
touch pages/tryout.tsx
```

```tsx
/* eslint react/react-in-jsx-scope: 0 */
/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { NextPage as NP } from "next";
import { useState, useCallback } from "react";

import type { ChangeEventHandler, FormEvent } from "react";

import { TextField, Button } from "@material-ui/core";

const TryOutPage: NP = () => {
  const [{ name, email, message }, setFields] = useState<{
    name: string;
    email: string;
    message: string;
  }>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) =>
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      console.log({ name, email, message });
      // IN HERE, LATER, WE WILL DEFINE NETWORK REQUEST
    },
    [name, email, message]
  );

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

          & button {
            margin-top: 8vh;
          }
        `}
      >
        <form onSubmit={handleSubmit}>
          <div className="field">
            <TextField
              onChange={handleChange}
              value={name}
              name="name"
              id="name-field"
              label="Name"
              placeholder="name"
              variant="filled"
            />
          </div>
          <div className="field">
            <TextField
              onChange={handleChange}
              value={email}
              type="email"
              name="email"
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
              onChange={handleChange}
              value={message}
              name="message"
              id="message-field"
              label="Message"
              placeholder="Message"
              multiline
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              rows={4}
            />
          </div>
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </form>
      </section>
    </main>
  );
};

export default TryOutPage;

```

# PASSWORDLES SIGNIN WITH NEXT-AUTH AND SENDGRID

<https://www.youtube.com/watch?v=61sMBUOUVww>

