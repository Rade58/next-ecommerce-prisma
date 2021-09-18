/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment } from "react";

import useClearCart from "../../hooks/useClearCart";

import type { PropsI } from "../../pages/order/[orderId]";

import SummaryOrderList from "./SummaryOrderList";

const Layout: FC<{
  order: PropsI["order"];
}> = ({ children, order }) => {
  const [cleared] = useClearCart();

  return (
    <Fragment>
      {cleared ? (
        <main>
          <section
            className="order-page-content"
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
            {children}
            <SummaryOrderList order={order} />
          </section>
        </main>
      ) : null}
    </Fragment>
  );
};

export default Layout;
