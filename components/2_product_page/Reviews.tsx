/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment, useEffect, useState } from "react";
import type { FC } from "react";

import { CircularProgress } from "@material-ui/core";

import { useSession } from "next-auth/client";

import type { ProductPageProps } from "../../pages/products/[prodId]";

const Reviews: FC<{
  reviews: ProductPageProps["product"]["reviews"];
  productId: string;
}> = ({ productId, reviews }) => {
  console.log();

  const [session, loading] = useSession();

  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    if (session) {
      if (session.profile && (session as any).profile.id) {
        setProfileId((session as any).profile.id as string);
      }
    }
  }, [session]);

  if (loading) {
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          margin-top: 38px;
        `}
      >
        <CircularProgress size={38} />
      </div>
    );
  }

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
