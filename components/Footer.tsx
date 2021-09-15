/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer
      css={css`
        margin-top: 166px;
        border-top: 1px solid #7296da81;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 10vh;
      `}
    >
      &copy; Fancy Parrot Shop
    </footer>
  );
};

export default Footer;
