/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useState, useCallback, useEffect, Fragment } from "react";

import { useRouter } from "next/router";
import Link from "next/link";

import Car from "react-material-ui-carousel";

import { Paper, Button } from "@material-ui/core";

const placeholderImage = "https://placeimg.com/640/480/any";

var items = [
  {
    name: "Random Name #1",
    description: "Probably the most random thing you have ever seen!",
    image: placeholderImage,
    src: "",
  },
  {
    name: "Random Name #2",
    description: "Hello World!",
    image: placeholderImage,
    src: "",
  },
];

const CarItem: FC<{
  item: {
    name: string;
    description: string;
    image: string;
  };
}> = (props) => {
  return (
    <section
      css={css`
        /* border: crimson solid 1px; */
        margin-top: -18px;

        & .prod-desc {
          background-image: linear-gradient(
            68.3deg,
            rgba(245, 177, 97, 1) 0.4%,
            rgba(236, 54, 110, 1) 100.2%
          );

          width: 50%;
        }
      `}
    >
      <div className="prod-desc">
        <h2>{props.item.name}</h2>
        <p>{props.item.description}</p>
        <Button className="CheckButton">Check it out!</Button>
      </div>
    </section>
  );
};

const Carousel: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [setMounted, mounted]);

  return (
    <Fragment>
      {mounted && (
        <Car>
          {items.map((item, i) => (
            <CarItem key={i} item={item} />
          ))}
        </Car>
      )}
    </Fragment>
  );
};

export default Carousel;
