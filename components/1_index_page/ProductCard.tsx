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
  makeStyles,
} from "@material-ui/core";

import type { ProductType } from "../../dummy/products";

const useStyles = makeStyles({
  myCard: {
    maxWidth: 345,
  },
});

const Product: FC<{ product: ProductType }> = ({ product }) => {
  const { name, image, description, productId } = product;

  const { myCard } = useStyles();

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
              <Typography variant="body2">{description}</Typography>
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
