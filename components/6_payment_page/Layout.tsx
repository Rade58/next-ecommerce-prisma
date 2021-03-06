/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import Steps from "../Steps";
import PaymentForm from "./PaymentForm";

const Layout: FC<{ initialPaymentMethod: string | null }> = ({
  children,
  initialPaymentMethod,
}) => {
  return (
    <main>
      <section
        className="payment-page-content"
        css={css`
          /* border: pink solid 2px; */
          margin: 20px auto;
          position: relative;
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 100%;
          align-items: center;
        `}
      >
        <Steps />
        <PaymentForm initialPaymentMethod={initialPaymentMethod} />
        {children}
      </section>
    </main>
  );
};

export default Layout;
