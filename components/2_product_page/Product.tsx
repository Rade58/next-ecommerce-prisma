/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment, useState, useEffect } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
// import type { ProductType } from "../../dummy/products";
import type { ProductPageProps } from "../../pages/products/[prodId]";
import { formatDistanceToNow } from "date-fns";

import {
  Button,
  Card,
  Grid,
  makeStyles,
  CardActions,
  Typography,
  CardContent,
  CardMedia,
  Paper,
  CircularProgress,
  List,
  Divider,
  Avatar,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import { useSession } from "next-auth/client";

const useStyles = makeStyles({
  kont: {
    height: "20vh",
  },
  pap: {
    height: "40vh",
  },
  papin: {
    height: "100%",
  },
  upper: {
    marginBottom: "60px",
    marginTop: "60px",
  },

  butti: {
    width: "100%",
  },
  inherColor: {
    backgroundColor: "inherit",
  },
});

const ProductSingle: FC<{ product: ProductPageProps["product"] }> = ({
  product,
}) => {
  const { back } = useRouter();
  const { kont, pap, papin, upper, butti, inherColor } = useStyles();

  const [reviews, setReviews] = useState(product.reviews);

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

  if (!product) {
    return null;
  }

  const {
    image,
    name,
    price,
    rating,
    numReviews,
    productId,
    description,
    countInStock,
  } = product;

  return (
    <Fragment>
      <Fragment>
        <Grid container className={upper}>
          <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
            <section>
              <Button color="primary" onClick={() => back()}>
                Go Back
              </Button>
            </section>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <Paper>
              <Card>
                <CardContent>
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      border: #19181a solid 1px;
                      border-bottom: transparent;
                      padding: 4px;
                    `}
                  >
                    <Typography variant="body1">status:</Typography>
                    <Typography variant="body1">
                      {countInStock ? "In Stock" : "Out Of Stock"}
                    </Typography>
                  </div>
                  <div
                    css={css`
                      display: flex;
                      justify-content: space-between;
                      border: #19181a solid 1px;
                      padding: 4px;
                    `}
                  >
                    <Typography variant="body1">price:</Typography>
                    <Typography variant="body1">${price}</Typography>
                  </div>
                </CardContent>
                <CardActions>
                  <Button
                    className={butti}
                    variant="contained"
                    size="large"
                    color="primary"
                    onClick={() => {}}
                  >
                    Add To Cart
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        </Grid>
        <Grid container className={papin}>
          <Grid item xs={12} sm={12} md={6} xl={7} className={papin}>
            <Paper elevation={3}>
              <CardMedia
                component="img"
                alt={name}
                // height="138"
                image={image}
                title={name}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12} md={6} xl={5} className={papin}>
            <Paper className={inherColor} elevation={0}>
              <CardContent className={inherColor}>
                <Typography variant="h6" component="h4">
                  {name}
                </Typography>
                <Typography variant="body1" component="p">
                  {description}
                </Typography>

                <Rating name="read-only" value={rating} precision={0.5} />
                <Typography variant="caption" component="i">
                  {numReviews} reviews
                </Typography>
                <Typography variant="h6" component="h3">
                  ${price}
                </Typography>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Fragment>
      {/* -------- REVIEWS -------- */}
      <Fragment>
        <section
          className="reviews-list"
          css={css`
            & li {
              display: flex;
              flex-direction: column;

              & time {
                display: flex;
                margin-top: 18px;
                margin-left: auto;
                font-size: 1.2em;
                color: #9e3f77;
                width: fit-content;
              }

              & h4 {
                color: #455f77;
                margin-left: 12px;
              }

              & .avat {
                display: flex;
                align-items: center;
                margin-left: 12px;
              }
            }
          `}
        >
          {/* {JSON.stringify({ productId, reviews, profileId }, null, 2)} */}
          <List component="ul" aria-label="reviews list">
            {reviews.map(({ comment, updatedAt, rating, user: profile }, i) => {
              //
              //
              //
              //

              let time: Date;

              if (updatedAt instanceof Date) {
                time = updatedAt;
              } else if (typeof updatedAt === "string") {
                time = new Date(updatedAt);
              } else {
                time = new Date();
              }

              const { user: prof } = profile;
              const { email } = prof;

              return (
                <li key={`${i}-rating`}>
                  <Paper>
                    <div className="avat">
                      <Avatar alt={email} src={"https://i.pravatar.cc/100"} />
                      <h4>{email}</h4>
                    </div>
                  </Paper>
                  <Paper>
                    <Rating name="rate-prod" value={rating} readOnly />
                  </Paper>
                  <Paper>{comment}</Paper>
                  <Paper>
                    <time>{formatDistanceToNow(time)}</time>
                  </Paper>
                  <Divider light />
                </li>
              );
            })}
          </List>
        </section>
        <section className="add-new-review"></section>
      </Fragment>
    </Fragment>
  );
};

export default ProductSingle;
