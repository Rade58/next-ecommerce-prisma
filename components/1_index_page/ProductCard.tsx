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

import type { ProductType } from "../../dummy/products";

const useStyles = makeStyles({
  myCard: {
    maxWidth: 345,
  },
  rat: {
    marginTop: "10px",
  },
});

const Product: FC<{ product: ProductType }> = ({ product }) => {
  const { name, image, productId, rating } = product;

  const { myCard, rat } = useStyles();

  return (
    <Grid className={myCard} item sm={12} md={6} lg={4} xl={4}>
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
              <Typography variant="h5" component="h2">
                {name}
              </Typography>

              <Typography className={rat} component="legend">
                rating:
              </Typography>
              <Rating name="read-only" value={rating} />
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
    </Grid>
  );
};

export default Product;
