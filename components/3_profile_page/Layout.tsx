/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Layout: FC = ({ children }) => {
  return (
    <main
      className="profile-page-content"
      css={css`
        /* border: pink solid 2px; */
        margin: 0px auto;
        position: relative;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

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
