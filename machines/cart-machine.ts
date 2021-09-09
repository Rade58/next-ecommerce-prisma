import { createMachine, assign, interpret } from "xstate";

import axios from "axios";

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
  moving_to_checkout = "moving_to_checkout",
  erasing_everything = "erasing_everything",
  stock_exceed = "stock_exceed",
  request_failed = "request_failed",
}

/**
 * @description EVENTS ENUM
 */
export enum EE {
  // GET_CART_ON_MOUNT = "GET_CART_ON_MOUNT",
  ADD_ITEM = "ADD_ITEM",
  REMOVE_ITEM = "REMOVE_ITEM",
  ERASE_EVERYTHING = "ERASE_EVERYTHING",
  // SERVER_RESPONDED = "SERVER_RESSPONDED",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  cart: CartRecord;
  lastItemId: string;
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
    }
  | {
      type: EE.ERASE_EVERYTHING;
      payload: {
        productId: string;
      };
    };
/* | {
      type: EE.SERVER_RESPONDED;
      payload: {
        productId: string;
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
>(
  {
    id: "main_machine",
    initial: fse.mounting_the_cart,
    context: {
      cart: CartStore.getCart(),
      lastItemId: "",
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
                lastItemId: (_, ev) => {
                  return ev.payload.item.productId;
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
                lastItemId: (_, ev) => {
                  return ev.payload.productId;
                },
              }),
            ],
            target: fse.removing_item,
          },
          [EE.ERASE_EVERYTHING]: {
            actions: [
              assign({
                cart: (_, __) => {
                  return CartStore.clearCart();
                },
                lastItemId: (_, ev) => {
                  return "";
                },
              }),
            ],
            target: fse.erasing_everything,
          },
        },
      },
      [fse.adding_item]: {
        //
        invoke: {
          id: "add_item",
          src: (ctx, event) => {
            const { lastItemId, cart } = ctx;

            const data = cart[lastItemId];

            return axios.put(`/api/cart/${lastItemId}`, {
              amount: data.amount,
              type: "cart-add",
            });
            // JUST TO SAY (DATA SHOUD BE INSIDE
            // AND YOU CAN DO ASSIGNS TO IN THESE ACTIONS
            //   onDone: {actions: [  (ctx, event) => {  event.data  }  ] }             )
            // MORE ON THAT HERE:
            // https://xstate.js.org/docs/guides/communication.html#invoking-promises
          },

          onDone: {
            target: fse.idle,
            // LIKE I SAID
            // DATA SHOULD BE ACCESSIBLE HERE
            // AND SINCE WE USEaxios DATA SHOUD BE IN   {data}
            actions: [
              (ctx, event) => {
                // LIKE I SAID DATA IS HERE
                console.log(
                  //
                  event.data.data
                  //
                );
              },
            ],
          },
          onError: {
            target: fse.request_failed,
            actions: [
              (ctx, event) => {
                // ERROR IS HERE (ALSO ON .data)
                console.log(
                  //
                  event.data
                  //
                );
              },
            ],
          },
        },
      },
      [fse.removing_item]: {
        //
        invoke: {
          id: "remove_item",
          src: (ctx, event) => {
            const { cart, lastItemId } = ctx;

            const data = cart[lastItemId];

            return axios.put(`/api/cart/${lastItemId}`, {
              amount: data.amount,
              type: "cart-remove",
            });
          },
          onDone: {
            target: fse.idle,
            actions: [
              (ctx, event) => {
                console.log(event.data.data);
              },
            ],
          },
          onError: {
            target: fse.request_failed,
            actions: [
              (ctx, event) => {
                console.log(event.data);
              },
            ],
          },
        },
      },
      [fse.erasing_everything]: {
        //
        always: {
          target: fse.idle,
        },
      },
      [fse.request_failed]: {
        after: {
          TWOSECONDSTOIDLE: {
            target: fse.idle,
          },
        },
      },
    },
  },
  {
    delays: {
      TWOSECONDSTOIDLE: 2000,
    },
  }
);

export const cartService = interpret(cartMachine);

cartService.onTransition((state, event) => {
  //
  console.log({ cart: state.context.cart });
  console.log("TRANSITION");
});
