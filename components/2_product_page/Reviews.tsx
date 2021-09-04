/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment } from "react";

const Reviews: FC = () => {
  return (
    <Fragment>
      <section className="reviews-list"></section>;
      <section className="add-new-review"></section>
    </Fragment>
  );
};

export default Reviews;
