/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useState, useCallback, useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import Car from "react-material-ui-carousel";

import { Paper, Button } from "@material-ui/core";

const CarItem: FC<{
  item: {
    name: string;
    description: string;
    image: string;
  };
}> = (props) => {
  return (
    <Paper>
      <h2>{props.item.name}</h2>
      <p>{props.item.description}</p>

      <Button className="CheckButton">Check it out!</Button>
    </Paper>
  );
};

const Carousel: FC = () => {
  var items = [
    {
      name: "Random Name #1",
      description: "Probably the most random thing you have ever seen!",
      image: "",
      src: "",
    },
    {
      name: "Random Name #2",
      description: "Hello World!",
      image: "",
      src: "",
    },
  ];

  return (
    <Car>
      {items.map((item, i) => (
        <Link href="/prods/1" key={`${i}-${item.name}`}>
          <a>
            <CarItem key={i} item={item} />
          </a>
        </Link>
      ))}
    </Car>
  );
};

export default Carousel;
