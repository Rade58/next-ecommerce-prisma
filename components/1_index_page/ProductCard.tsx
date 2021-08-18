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
} from "@material-ui/core";

import type { ProductType } from "../../dummy/products";

const Product: FC<{ product: ProductType }> = ({ product }) => {
  const { name, image, description } = product;

  return (
    <Grid>
      <Paper>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={name}
              height="160"
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
