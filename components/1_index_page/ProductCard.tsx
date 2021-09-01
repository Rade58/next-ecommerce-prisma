/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import Router from "next/router";

import {
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  makeStyles,
} from "@material-ui/core";

import { Rating } from "@material-ui/lab";

// import type { Product as ProductType } from "@prisma/client";

import type { Products as ProductsType } from "../../pages/index";

// import type { ProductType } from "../../dummy/products";

const useStyles = makeStyles({
  rat: {
    marginTop: "10px",
  },
});

const Product: FC<{ product: ProductsType[0] }> = ({ product }) => {
  const { name, image, productId, rating, price, numReviews } = product;

  const { rat } = useStyles();

  return (
    <div className="my-card">
      <Paper>
        <Card>
          <CardActionArea onClick={() => Router.push(`/products/${productId}`)}>
            <CardMedia
              component="img"
              alt={name}
              // height="138"
              image={image}
              title={name}
            />
            <CardContent>
              <Typography variant="h6" component="h4">
                {name}
              </Typography>

              <Rating
                name="read-only"
                value={rating}
                precision={0.5}
                readOnly
              />
              <Typography variant="caption" component="i">
                {numReviews} reviews
              </Typography>
              <Typography className={rat} variant="h6" component="h3">
                ${price}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            <Button
              size="small"
              color="primary"
              onClick={() => Router.push(`/products/${productId}`)}
            >
              View Product
            </Button>
          </CardActions>
        </Card>
      </Paper>
    </div>
  );
};

export default Product;
