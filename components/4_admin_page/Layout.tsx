/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <main
      className="admin-page-content"
      css={css`
        /* border: pink solid 2px; */
        margin: 0px auto;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;

        align-items: center;

        @media screen and (min-width: 680px) {
          width: 80vw;
        }
      `}
    >
      {children}
    </main>
  );
};

export default Layout;
