/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

const Footer: FC = () => {
  return (
    <footer
      css={css`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80vh;
      `}
    >
      footer &copy; My Shop
    </footer>
  );
};

export default Footer;
