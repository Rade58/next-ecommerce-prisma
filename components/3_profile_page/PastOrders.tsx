/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import Link from "next/link";

import { Link as MuiLink } from "@material-ui/core";

import type { Order } from "@prisma/client";

interface PropsI {
  orders: Order[];
}

const PastOrders: FC<PropsI> = ({ orders }) => {
  return (
    <div>
      {/* <pre>{JSON.stringify(orders, null, 2)}</pre> */}

      <nav>
        {orders.map(({ id }, i) => {
          return (
            <Link passHref href={`/orders/${id}`} key={`${id}-${i}`}>
              <MuiLink component="button" variant="body2">
                {id}
              </MuiLink>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default PastOrders;
