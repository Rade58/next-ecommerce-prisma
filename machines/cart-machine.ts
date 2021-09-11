import { createMachine, assign, interpret } from "xstate";

import axios from "axios";

import CartStore from "../lib/cart-cookies";
import type { CartRecord, ItemIn } from "../lib/cart-cookies";

import { afterDate, elapsed } from "../lib/date";

// IMPORT TYPE FROM PRISMA
import type { Product } from "@prisma/client";

// ACTION NAMES
enum AA {
  EXPIRATION_MANIPULATION = " EXPIRATION_MANIPULATION",
  CLEAR_TIMER = "CLEAR_TIMER",
}

//

/**
 * @description finite states enum
 */
export enum fse {
  mounting_the_cart = "mounting_the_cart",
  idle = "idle",
  adding_item = "adding_item",
  removing_item = "removing_item",
  // I DON'T THINK THIS IS RELEVENT TO CART
  // moving_to_checkout = "moving_to_checkout",
  erasing_everything = "erasing_everything",
  // WE DON'T NEED THIS BECAUSE WE ARE HANDLING THIS BACKEND
  // stock_exceed = "stock_exceed",
  request_failed = "request_failed",
  cart_expired = "cart_expired",
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
  TICK = "TICK",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  cart: CartRecord;
  lastItem: ItemIn | null;
  lastItemId: string;
  expired: boolean;
  clockOffset: number;
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
        item: ItemIn;
      };
    }
  | {
      type: EE.ERASE_EVERYTHING;
      payload: {
        productId: string;
      };
    }
  | {
      type: EE.TICK;
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
  /* | {
      value: fse.stock_exceed;
      context: MachineContextGenericI;
    } */
  | {
      value: fse.cart_expired;
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
      lastItem: null,
      lastItemId: "",
      expired: false,
      //
      clockOffset: 1000 * 60 * 60 * 8, // 8 hours
    },
    // ---- EVENTS RECEVIED WHEN CURRENT FINITE STATE DOESN'T MATTER -----
    on: {
      [EE.TICK]: {
        actions: [
          assign({
            expired: (ctx, __) => {
              return CartStore.timeExpired();
            },
          }),
        ],

        cond: (ctx, ev) => {
          return ctx.expired;
        },
        target: fse.cart_expired,
      },
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
              AA.EXPIRATION_MANIPULATION,
              assign({
                lastItem: (_, ev) => {
                  return ev.payload.item;
                },
              }),
              assign({
                lastItemId: (_, ev) => {
                  return ev.payload.item.productId;
                },
              }),
            ],
            target: fse.adding_item,
          },
          [EE.REMOVE_ITEM]: {
            actions: [
              AA.EXPIRATION_MANIPULATION,
              assign({
                lastItem: (_, ev) => {
                  return ev.payload.item;
                },
              }),
              assign({
                lastItemId: (_, ev) => {
                  return ev.payload.item.productId;
                },
              }),
            ],
            target: fse.removing_item,
          },
          [EE.ERASE_EVERYTHING]: {
            actions: [
              AA.CLEAR_TIMER,
              assign({
                lastItem: (_, ev) => {
                  return null;
                },
              }),
              assign({
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
            const { lastItem, cart, lastItemId } = ctx;

            return axios.put(`/api/cart/${lastItemId}`, {
              amount: lastItem?.amount || 0,
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
              // (ctx, event) => {
              // LIKE I SAID DATA IS HERE
              // console.log(

              // event.data.data

              // );
              // },
              assign({
                cart: (ctx, ev) => {
                  const cart = ctx.cart;

                  const updatedProduct = ev.data.data as Product;

                  let amount = 1;

                  if (cart[updatedProduct.productId]) {
                    amount = amount + cart[updatedProduct.productId].amount;
                  }

                  cart[updatedProduct.productId] = {
                    amount,
                    countInStock: updatedProduct.countInStock,
                    price: updatedProduct.price,
                    productId: updatedProduct.productId,
                  };

                  CartStore.setCartItem(cart[updatedProduct.productId]);

                  return cart;
                },
              }),
            ],
          },
          onError: {
            target: fse.request_failed,
            actions: [
              (ctx, event) => {
                // ERROR IS HERE (ALSO ON .data)
                // BUT SINCE WE USE AXIOS ERROR IS ON .error
                console.log(
                  //
                  event.data.error
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
            const { cart, lastItem, lastItemId } = ctx;

            const data = cart[lastItemId];

            return axios.put(`/api/cart/${lastItemId}`, {
              amount: data.amount,
              type: "cart-remove",
            });
          },
          onDone: {
            target: fse.idle,
            actions: [
              // (ctx, event) => {
              // console.log(event.data.data);
              // },
              assign({
                cart: (ctx, ev) => {
                  const cart = ctx.cart;

                  const updatedProduct = ev.data.data as Product;

                  let amount = -1;

                  if (cart[updatedProduct.productId]) {
                    amount = amount + cart[updatedProduct.productId].amount;
                  }

                  cart[updatedProduct.productId] = {
                    amount,
                    countInStock: updatedProduct.countInStock,
                    price: updatedProduct.price,
                    productId: updatedProduct.productId,
                  };

                  CartStore.setCartItem(cart[updatedProduct.productId]);

                  return cart;
                },
              }),
            ],
          },
          onError: {
            target: fse.request_failed,
            actions: [
              (ctx, event) => {
                console.log(event.data.error);
              },
            ],
          },
        },
      },
      [fse.erasing_everything]: {
        //
        invoke: {
          id: "erase_everything",
          src: (ctx, event) => {
            const { cart } = ctx;

            const data = Object.values(cart);

            return axios.put("/api/cart/products", data);
          },
          onDone: {
            target: fse.idle,
            actions: [
              assign({
                cart: (_, ev) => {
                  console.log(ev.data.data);

                  return CartStore.clearCart();
                },
              }),
            ],
          },
          onError: {
            target: fse.request_failed,
            actions: [
              (ctx, event) => {
                console.log(event.data.error);
              },
            ],
          },
        },
      },
      [fse.cart_expired]: {
        // YOU NEED TO CLEAR CART AND CLEAR TIMER
        entry: [
          assign({
            cart: (ctx, ev) => {
              CartStore.clearTimer();

              return CartStore.clearCart();
            },
          }),
        ],
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
    actions: {
      [AA.EXPIRATION_MANIPULATION]: (ctx, ev) => {
        CartStore.setExpirationTime(ctx.clockOffset);
      },
      [AA.CLEAR_TIMER]: (ctx, ev) => {
        CartStore.clearTimer();
      },
    },
  }
);

export const cartService = interpret(cartMachine);

cartService.onTransition((state, event) => {
  //
  console.log({ cart: state.context.cart });
  console.log("TRANSITION");
});
