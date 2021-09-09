import { createMachine, assign, interpret } from "xstate";

import CartStore from "../lib/cart-cookies";
import type { CartRecord, ItemIn } from "../lib/cart-cookies";

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
  // GET_CART_ON_MOUNT = "GET_CART_ON_MOUNT",
  ADD_ITEM = "ADD_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  cart: CartRecord;
}

export type machineEventsGenericType =
  | {
      type: EE.ADD_ITEM;
      payload: {
        item: ItemIn;
      };
    }
  | {
      type: EE.REMOVE_ITEM;
      payload: {
        productId: string;
      };
    };

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
      always: {
        target: fse.idle,
      },
    },
    [fse.idle]: {
      //
      on: {
        [EE.ADD_ITEM]: {
          actions: [
            assign({
              cart: (_, ev) => {
                const {
                  item: { amount, productId },
                } = ev.payload;

                return CartStore.setCartItem({
                  amount,
                  productId,
                });
              },
            }),
          ],
          target: fse.adding_item,
        },
        [EE.REMOVE_ITEM]: {
          actions: [
            assign({
              cart: (_, ev) => {
                const { productId } = ev.payload;

                return CartStore.removeCartItem(productId);
              },
            }),
          ],
          target: fse.removing_item,
        },
      },
    },
    [fse.adding_item]: {
      //
      always: {
        target: fse.idle,
      },
    },
    [fse.removing_item]: {
      //
      always: {
        target: fse.idle,
      },
    },
  },
});

export const cartService = interpret(cartMachine);

cartService.onTransition((state, event) => {
  //
  console.log({ cart: state.context.cart });
  console.log("TRANSITION");
});
