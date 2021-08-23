# WE DON'T WANT TO USE `/api/auth/signin` AS OUR SIGNIN PAGE, WE WANT CUSTOM PAGE

**ALSO WE WILL CREATE CUSTOM "verify email page"**(A PAGE WHERE USER IS REDDIRECTED AFTER SUBMITING EMAIL)

MAYBE LATER I'LL ADD CUSTOM ERROR PAGE

BUT FOR NOW, BEFORE WE MADE ACTUAL PAGE LETS SPECIFY OUR CUSTOM SIGNIN PAGE IN OUR NEXT-AUTH CONFIGURATION

```
code pages/api/auth/[...nextauth].ts
```

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prismaClient from "../../../lib/prisma";

const handler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, {
    providers: [
      Providers.Email({
        server: {
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT),
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: process.env.FROM_EMAIL,
      }),
    ],

    database: process.env.DATABASE_URL,
    secret: process.env.SECRET,
    adapter: PrismaAdapter(prismaClient),

    /* session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    jwt: {
      secret: "VD01eYRMrJ5EG3EOJ8HjO9lgqmp4U8n7ro8pGq3838s",
      encryption: true,
    },

    debug: true, */

    // -------- I ADDED THIS --------
    // I SPECIFIED THE NEW LOGIN PAGE
    // AND PAGE WITH INFO THAT USER NEEDS TO CHECK HIS EMAIL
    pages: {
      signIn: "/signin",
      verifyRequest: "/veryify-email-info",
      // YOU CAN SET UP SOME MORE PAGES
      // CHACK THAT OUT IN SPARE TIME
    },
  });

export default handler;

```

# LET'S NOW BUILD PAGES WE SPECIFIED

```
code pages/signin.tsx
```

```tsx
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

// WE ARE GOING TO USE SIGNING IN WITH EMAIL LOGIC LIKE THIS
// AND WE NEED TO CHECK SESSION
import { signIn, useSession } from "next-auth/client";
//
//

const SignInPage: NP = () => {
  const { push } = useRouter();
  const [session, loading] = useSession();

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
```

```
touch pages/veryify-email-info.tsx
```

```tsx
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
```

## WE NEED TO UPDATE LINK THAT POINTS TO LOGIN PAGE

```
code 
```

```jsx
{/* ... */}
{/* ... */}
{/* HERE YOU GO  */}
<Button
  // INSTEAD OF THIS
  // onClick={() => Router.push("/api/auth/signin")}
  // WE DEFINE THIS
  onClick={() => Router.push("/signin")}
  // 
  color="secondary"
  variant="contained"
>
  Login
</Button>
```


# I TRIED IT AND IT SEEMS TO WORK

