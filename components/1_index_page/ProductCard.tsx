/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import Image from "next/image";

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
  const { name, image, description } = product;

  const { myCard } = useStyles();

  return (
    <Grid className={myCard} item>
      <Paper>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={name}
              height="120"
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
            <Button size="small" color="primary">
              Share
            </Button>
          </CardActions>
        </Card>
      </Paper>
    </Grid>
  );
};

export default Product;
