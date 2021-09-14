/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <main>
      <section
        className="shipping-page-content"
        css={css`
          /* border: pink solid 2px; */
          margin: 20px auto;
          position: relative;
          display: flex;
          justify-content: center;
          width: 100%;
        `}
      >
        {children}
      </section>
    </main>
  );
};

export default Layout;