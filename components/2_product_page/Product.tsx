/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment, useState, useEffect, useCallback } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
// import type { ProductType } from "../../dummy/products";
import { formatDistanceToNow } from "date-fns";

import axios from "axios";

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
  Box,
  TextField,
} from "@material-ui/core";
import { Rating, Alert } from "@material-ui/lab";

import { useSession } from "next-auth/client";

import type { ProductPageProps } from "../../pages/products/[prodId]";

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
  const [numReviews, setNumReviews] = useState(product.reviews.length);

  const [session, loading] = useSession();

  const [profileId, setProfileId] = useState<string>("");

  const [stars, setStars] = useState<number>(0);

  const [revComment, setRevComment] = useState<string>("");
  const [averageProductRating, setAverageProductRating] = useState(0);

  const [reqStatus, setReqStatus] = useState<"idle" | "pending" | "failed">(
    "idle"
  );

  useEffect(() => {
    if (session) {
      if (session.profile && (session as any).profile.id) {
        setProfileId((session as any).profile.id as string);
      }
    }
  }, [session]);

  useEffect(() => {
    //

    if (!reviews) return;

    console.log({ reviews });

    let aver: number = 0;

    for (const rev of reviews) {
      console.log({ rat: rev.rating });

      aver = aver + rev.rating;
    }

    setAverageProductRating(aver / reviews.length);
  }, [setAverageProductRating, reviews]);

  useEffect(() => {
    if (!reviews) return;

    setNumReviews(reviews.length);
  }, [reviews, setNumReviews]);

  const makeReview = useCallback(
    async (productId: string, profileId: string) => {
      if (!stars) return;
      if (!revComment) return;

      try {
        //
        setReqStatus("pending");

        const { data } = await axios.post(`/review/${productId}`, {
          profileId,
          rating: stars,
          comment: revComment,
        });

        setReviews(data);

        setReqStatus("idle");
      } catch (err) {
        console.error(err);

        setReqStatus("failed");

        setTimeout(() => {
          setReqStatus("idle");
        }, 3000);
      }
    },
    [stars, revComment, setReqStatus, setReviews]
  );

  console.log(
    JSON.stringify({
      stars,
      revComment,
    })
  );

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
    // numReviews,
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
                Average Rating:
                <Rating
                  name="read-only"
                  value={averageProductRating}
                  precision={1}
                  readOnly
                />
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
        <section className="add-new-review">
          <Box
            component="form"
            css={css`
              & > :not(style) {
                margin: 18px;
                display: flex;
                width: 80%;
                margin-left: auto;
                margin-right: auto;

                & h3 {
                  margin-left: 28px;
                  color: crimson;
                }
              }
            `}
          >
            <h3>Rate Our Product:</h3>
            <Rating
              name="size-large"
              defaultValue={2.5}
              size="large"
              precision={1}
              onChange={(e) => {
                // @ts-ignore
                if (!e.target?.value) return;
                // @ts-ignore
                const val = parseInt(e.target.value);

                setStars(val);
              }}
            />
            <TextField
              id="review-field"
              label="And Leave a Review"
              variant="outlined"
              onChange={(e) => {
                const comment = e.target.value;

                setRevComment(comment);
              }}
            />
          </Box>
          <div
            css={css`
              margin-left: 70%;
            `}
          >
            <Button
              onClick={() => {
                makeReview(product.productId, profileId);
              }}
              disabled={reqStatus !== "idle"}
              variant="contained"
            >
              Save{" "}
              {!session && reqStatus !== "idle" && (
                <CircularProgress size={9} />
              )}
            </Button>
          </div>
          {reqStatus === "failed" && (
            <Alert severity="error">
              Server error (can{"'"}t make a review)
            </Alert>
          )}
        </section>

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

              & .rate {
                margin-left: 12px;
              }

              & .comm {
                padding: 10px;
                padding-top: 4px;
                padding-bottom: 4px;
              }
            }
            & h2.htwo {
              margin-top: 38px;
            }
          `}
        >
          <h2 className="htwo">Some of our satisfied customers</h2>
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
                    <div className="rate">
                      <Rating
                        name="rate-prod"
                        value={rating}
                        readOnly
                        precision={1}
                      />
                    </div>
                  </Paper>
                  <Paper>
                    <p className="comm">{comment}</p>
                  </Paper>
                  <Paper>
                    <time>{formatDistanceToNow(time)}</time>
                  </Paper>
                  <Divider light />
                </li>
              );
            })}
          </List>
        </section>
      </Fragment>
    </Fragment>
  );
};

export default ProductSingle;
