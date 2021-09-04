/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { Fragment } from "react";
import type { ProductPageProps } from "../../pages/products/[prodId]";

const Reviews: FC<{
  reviews: ProductPageProps["product"]["reviews"];
  productId: string;
  profileId: string;
}> = ({ productId, reviews, profileId }) => {
  console.log();

  return (
    <Fragment>
      <section className="reviews-list">
        {JSON.stringify({ productId, reviews, profileId }, null, 2)}
      </section>
      ;<section className="add-new-review"></section>
    </Fragment>
  );
};

export default Reviews;
