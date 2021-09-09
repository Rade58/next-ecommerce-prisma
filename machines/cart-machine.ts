import { createMachine, assign, interpret } from "xstate";

import CartStore from "../lib/cart-cookies";
import type { CartRecord } from "../lib/cart-cookies";

// type CartRecord = Record<string, { productId: string; amount: number }>;

/**
 * @description finite states enum
 */
export enum fse {
  mounting_the_cart = "mounting_the_cart",
  idle = "idle",
  adding_item = "adding_item",
  removing_item = "removing_item",
  stock_exceed = "stock_exceed",
  moving_to_checkout = "moving_to_checkout",
  erasing_everything = "erasing_everything",
}

/**
 * @description EVENTS ENUM
 */
export enum EE {
  GET_CART_ON_MOUNT = "GET_CART_ON_MOUNT",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  cart: CartRecord;
}

export type machineEventsGenericType = {
  type: EE.GET_CART_ON_MOUNT;
  payload: {
    cart: CartRecord;
  };
};
/* | {
      type: EE.PLACEHOLDING_ONE;
      payload: {
        placeholder: number;
      };
    } */

export type machineFiniteStatesGenericType =
  | {
      value: fse.mounting_the_cart;
      context: MachineContextGenericI;
    }
  | {
      value: fse.idle;
      context: MachineContextGenericI;
    }
  | {
      value: fse.adding_item;
      context: MachineContextGenericI;
    }
  | {
      value: fse.removing_item;
      context: MachineContextGenericI;
    }
  | {
      value: fse.stock_exceed;
      context: MachineContextGenericI;
    }
  | {
      value: fse.moving_to_checkout;
      context: MachineContextGenericI;
    }
  | {
      value: fse.erasing_everything;
      context: MachineContextGenericI;
    };

// -----------------  MACHINE --------------------

const cartMachine = createMachine<
  MachineContextGenericI,
  machineEventsGenericType,
  machineFiniteStatesGenericType
>({
  id: "main_machine",
  initial: fse.mounting_the_cart,
  context: {
    cart: CartStore.getCart(),
  },
  // ---- EVENTS RECEVIED WHEN CURRENT FINITE STATE DOESN'T MATTER -----
  on: {
    /* [EE.CHECK_CURRENT_DARK_MODE]: {
      actions: [
        assign((ctx, event) => {
          const { isDark } = event.payload;

          return {
            isDarkMode: isDark,
          };
        }),
      ],
    }, */
  },
  // -------------------------------------------------------------------
  states: {
    [fse.mounting_the_cart]: {
      entry: [
        assign({
          cart: (_, __) => {
            const currentCart = CartStore.getCart();

            return currentCart;
          },
        }),
      ],
    },
    [fse.idle]: {},
  },
});

export const cartService = interpret(cartMachine);

cartService.onTransition((state, event) => {
  //
  console.log({ cart: state.context.cart });
  console.log("TRANSITION");
});
