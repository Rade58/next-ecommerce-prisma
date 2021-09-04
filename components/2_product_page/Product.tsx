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
  ListItem,
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
        <section className="reviews-list">
          {/* {JSON.stringify({ productId, reviews, profileId }, null, 2)} */}
          <List component="ul" aria-label="reviews list">
            {reviews.map(({ comment, updatedAt, rating, user: profile }, i) => {
              //
              //
              //
              //

              console.log(updatedAt);
              console.log(updatedAt instanceof Date);

              // const

              const { user: prof } = profile;
              const { email } = prof;

              return (
                <li key={`${i}-rating`}>
                  <Paper>{email}</Paper>
                  <Paper>{comment}</Paper>
                  {/* <Paper>{formatDistanceToNow(new Date(updatedAt ))}</Paper> */}
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
