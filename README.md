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

import { TextField, Button, CircularProgress } from "@material-ui/core";

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

      // IN HERE, LATER, WE WILL DEFINE NETWORK REQUEST
      // I AM SIMULATING IT FOR NOW
      setReqStatus("pending");

      setTimeout(() => {
        setReqStatus("idle");
      }, 2000);
    },
    [name, email, message, setReqStatus]
  );

  const buttonDisabled =
    !name || !email || !message || reqStatus === "pending" ? true : false;

  return (
    <main>
      <h1>
        This page is only made for practicing{" "}
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
              placeholder="Name"
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
              placeholder="Email address"
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
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={buttonDisabled}
          >
            {"Send "}
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

export default TryOutPage;
```

## BUILDING API ROUTE, WE WILL NAME IT: `pages/api/mail.ts`, AND FOR NOW IT IS ONLY GOING TO RETURN "Hello world"

IT IS GOING TO BE "POST" ROUTE

```
touch pages/api/mail.ts
```

```ts
import nc from "next-connect";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  // BECAUSE WE USE NEXT-CONNECT, body WILL BE PARSED
  // WE DON'T NEED TO USE JSON.parse
  const { body } = req;

  res.status(200).json("Hello World");
});

export default handler;
```

# RIGHT NOW, WE NEED TO SETUP SENDGRID

WE SIGNUP FOR ACCOUNT, AND JUST FOR YOU TO KNOW, WE HAVE FREE TIER, WHERE WE ARE NOT GOING TO SPEND ANY MAONEY

## WE NEED TO AUTHENTICATE CUSTOM DOMAIN AT SENDGRID

WE ARE GOING TO `Settings` --> `Sender Authentication`

**WE NEED THIS BECAUSE IT IS BETTER EXPERIENCE FOR USER WHEN THEY KNOW THAT EMAIIL IS COMMING FROM YOUR DOMAIN**

I'M PRETTY SURE I HAVE SOME `Namecheap` DOMAINS

SO I'M GOING TO PICK ONE PRESS ON `Get Started` AND ENTER YOUR DOMAIN HOST (FOR ME THAT'S Namecheap)

THAN PRESS NEXT

NOW WE NEED TO ADD ACTUAL DOMAIN

CLICK NEXT

HERE WE CAN SEE DNS RECORDS, **YOU NEED TO, COPY AND SET THOSE DNS RECORDS IN YOUR `Namecheap` DASBOARD, FOR YOUR DOMAIN (YOU KNOW WHERE TO SET THAT) (IN NAMECHEAP YOU PICK `Advanced Dns` TABE, AND THERE YOU SET UP 3 CNAME RECORDS)**

***
***

ONE IMPORTANT THING (FOR `Host` OPTION OF YOUR CNAME RECORDS DON'T USE WHOLE THING YOU COPIED)

JUST INPUT FIRST HALF (I HAD `<something>.moutfull.xyz`) (WELL, **I DIDN'T ENTER `moutfull.xyz`. I ENTERED JUST `<something>`**)

***
***

GO BACK TO SENDGRID DASBOARD AND CONTINUE WHERE YOU LEFT

YOU NEED TO CHECK CHEKBOX WITH A NAME `I've added these records`

AND PRESS ON `Verify` BUTTON

**THIS WAS SUCCESS, AND I CAN PRESS ON `Return To Sender Authentication` BUTTON**

***
***

ONE MORE NOTICE

SINCE WE ADDED THESE RECORDS FOR THE FIRST TIME EVER FOR OUR DOMAIN, IT PROPAGATED PRETTY QUICLY

I THINK IN CASE OF CHANGING FROM SOME OLD RECORDS, THAT CANTKE UP TO 48 HOURS TO PROPAGATE

***
***

## NOW WE NEED TO CREATE OUR API KEY INSIDE SENDGRID DASBOARD

`Settings` --> `API keys` --> `Create Api Key`

NAME YOUR KEY WHAT EVER YOU WANT

THEN SET A PERMISSIONS, I'LL LEAVE MY ON FULL ACCESS PERMISSION (**BUT YOU CAN CUSTOMIZE PERMISSIONS BY PICKING RESTRICTED ACCESS PERMISSION,**)

I PICKED FULL ACCESS, AND CLICKED ON `Create And View`

COPY THE KEY, AND JUST YOU KNOW, THIS KEY YOU CAN NEVER SEE AGAIN INSIDE SENDGRID DASBOARD JUST FOR THE SECURITY REASONS

IN OUR PROJECT SET THAT KEY INSIDE ENV VARIABLE `SENDGRID_API_KEY`

```
code .env.local
```

```c#
// ...
// ...
SENDGRID_API_KEY=
```

<!--  -->

GREEN MESSAGE FOR `Create Sender Identity`


# PASSWORDLES SIGNIN WITH NEXT-AUTH AND SENDGRID

<https://www.youtube.com/watch?v=61sMBUOUVww>

