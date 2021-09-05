/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import { TextField } from "@material-ui/core";

const Search: FC = () => {
  return (
    <section className="search-box">
      <TextField />
    </section>
  );
};

export default Search;
