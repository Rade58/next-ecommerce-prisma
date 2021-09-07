/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";
import { useState, useCallback, useEffect, Fragment } from "react";

import Router from "next/router";

import Image from "next/image";

import axios from "axios";

import { Button } from "@material-ui/core";

import Car from "react-material-ui-carousel";

const placeholderImage = "https://picsum.photos/300/200";

interface ProductItemI {
  name: string;
  description: string;
  image: string;
  productId: string;
}

var placeholderItems: ProductItemI[] = [
  {
    name: "Random Name #1",
    description: "Probably the most random thing you have ever seen!",
    image: placeholderImage,
    productId: "",
  },
  {
    name: "Random Name #2",
    description: "Hello World!",
    image: placeholderImage,
    productId: "",
  },
];

const CarItem: FC<{
  item: ProductItemI;
}> = (props) => {
  return (
    <section
      css={css`
        /* border: crimson solid 1px; */
        /* margin-top: 12px; */
        /* height: 62vh; */

        position: relative;
        display: flex;

        & .prod-desc {
          background-image: linear-gradient(
            68.3deg,
            rgba(245, 177, 97, 1) 0.4%,
            rgba(236, 54, 110, 1) 100.2%
          );
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          width: 36%;
          height: 60vh;

          & h2 {
            margin-bottom: 20px;
            margin-top: 20px;
            position: absolute;
            top: 10%;
            left: 20%;
            max-width: 70%;
            z-index: 200;
            color: #95dfcfef;
            font-size: 2.2em;
            font-family: ubuntu, -apple-system, BlinkMacSystemFont, "Segoe UI",
              Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
              sans-serif;
            background-color: #6d79a01a;
            /* padding: 10px; */
            text-align: center;
            /* border-radius: 20px; */
            box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset,
              rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset,
              rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset,
              rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
              rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
              rgba(0, 0, 0, 0.09) 0px 32px 16px;
            text-shadow: 1px 1px 1px black;
          }
          & p {
            margin-bottom: 20px;
            margin-top: 20px;
            position: absolute;
            top: 38%;
            left: 50%;
            max-width: 40%;
            z-index: 200;
            color: #95dfcfef;
            font-family: ubuntu, -apple-system, BlinkMacSystemFont, "Segoe UI",
              Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
              sans-serif;
            font-size: 1.2em;

            margin-right: 60px;
            background-color: #6d79a021;
            text-align: center;
            border-radius: 2px;
            /* padding: 10px; */
            box-shadow: rgba(240, 46, 170, 0.4) -5px 5px,
              rgba(240, 46, 170, 0.3) -10px 10px,
              rgba(240, 46, 170, 0.2) -15px 15px,
              rgba(240, 46, 170, 0.1) -20px 20px,
              rgba(240, 46, 170, 0.05) -25px 25px;
            text-shadow: 1px 1px 1px black;
          }

          & div.butt-holder {
            width: 100%;
            /* border: pink solid 4px; */
            display: flex;
            margin-top: auto;
            margin-bottom: 10px;

            & button {
              margin-left: auto;
              margin-right: 10%;
            }
          }
        }

        & .prod-image {
          /* border: crimson solid 2px; */
          width: 64%;
          display: inline-block;

          overflow: hidden;

          & > div {
            width: 100%;
            position: relative;
            height: 60vh;

            /* border: tomato solid 4px; */
          }
        }
      `}
    >
      <div className="prod-desc">
        <h2>{props.item.name}</h2>
        <p>{props.item.description}</p>
        <div className="butt-holder">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              Router.push(`/products/${props.item.productId}`);
            }}
          >
            Check it out!
          </Button>
        </div>
      </div>
      <div className="prod-image">
        <div>
          <Image
            src={props.item.image}
            alt="product image"
            layout="fill"
            objectFit="cover"
            // objectPosition="center center"
            // objectPosition="20 20"
            // width="100"
            // height="100"
          />
        </div>
      </div>
    </section>
  );
};

const Carousel: FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);

  const [reqStatus, setReqStatus] = useState<"idle" | "pending" | "failed">(
    "idle"
  );

  const [products, setProducts] = useState<ProductItemI[]>([]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, [setMounted, mounted]);

  const handleRequest = useCallback(async () => {
    try {
      setReqStatus("pending");

      const { data: prods }: { data: ProductItemI[] } = await axios.get(
        "/api/products/top"
      );

      setProducts(prods);

      setReqStatus("idle");
    } catch (error) {
      console.error(error);

      setReqStatus("failed");
    }
  }, [setReqStatus, setProducts]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);

  return (
    <Fragment>
      {mounted && reqStatus === "idle" && (
        <Car>
          {products.map((item, i) => (
            <CarItem key={i} item={item} />
          ))}
        </Car>
      )}
      {reqStatus === "failed" && (
        <Car>
          {placeholderItems.map((item, i) => (
            <CarItem key={i} item={item} />
          ))}
        </Car>
      )}
    </Fragment>
  );
};

export default Carousel;
