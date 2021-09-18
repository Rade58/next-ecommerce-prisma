/* eslint jsx-a11y/anchor-is-valid: 1 */
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import type { FC } from "react";

import type { Order } from "@prisma/client";

interface PropsI {
  orders: Order[];
}

const PastOrders: FC<PropsI> = ({ orders }) => {
  return (
    <div>
      <pre>{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
};

export default PastOrders;
