/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { Fragment } from "react";
import type { FC } from "react";
import { useRouter } from "next/router";
import type { ProductType } from "../../dummy/products";

import {
  Button,
  Card,
  Grid,
  makeStyles,
  CardActionArea,
  CardActions,
  Typography,
  CardContent,
  CardMedia,
  Paper,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";

import Image from "next/image";

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
});

const ProductSingle: FC<{ product: ProductType }> = ({ product }) => {
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
  const { back } = useRouter();
  const { kont, pap, papin, upper, butti } = useStyles();

  return (
    <Fragment>
      <Grid container className={upper}>
        <Grid item sm={6} md={6} lg={6} xl={6}>
          <section>
            <Button color="primary" onClick={() => back()}>
              Go Back
            </Button>
          </section>
        </Grid>

        <Grid item sm={6} md={6} lg={6} xl={6}>
          <Paper>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h6" component="h4">
                    status: {countInStock ? "In Stock" : "Not In Stock"}
                  </Typography>
                  <Typography variant="h6" component="h4">
                    status: {countInStock ? "In Stock" : "Not In Stock"}
                  </Typography>

                  <Typography variant="h6" component="h3">
                    price: ${price}
                  </Typography>
                  <Typography variant="h6" component="h3">
                    price: ${price}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  className={butti}
                  variant="contained"
                  size="large"
                  color="secondary"
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
          <Paper elevation={0}>
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
          <Paper elevation={0}>
            <CardContent>
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
  );
};

export default ProductSingle;
