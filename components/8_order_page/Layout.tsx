/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment } from "react";

import useClearCart from "../../hooks/useClearCart";

const Layout: FC = ({ children }) => {
  const [cleared] = useClearCart();

  return (
    <Fragment>
      {/* {cleared ? ( */}
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
        </section>
      </main>
      {/*) : null}*/}
    </Fragment>
  );
};

export default Layout;
