import { createMachine, assign, interpret } from "xstate";
import type { EventObject } from "xstate";

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
  SET_LAST_ITEM = "SET_LAST_ITEM",
  UNSET_LAST_ITEM = "UNSET_LAST_ITEM",
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
  clearing_product = "clearing_product",
  // I DON'T THINK THIS IS RELEVENT TO CART
  // moving_to_checkout = "moving_to_checkout",
  clearing_cart = "clearing_cart",
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
  // ERASE_EVERYTHING = "ERASE_EVERYTHING",
  // SERVER_RESPONDED = "SERVER_RESSPONDED",
  CLEAR_PRODUCT = "CLEAR_PRODUCT",
  CLEAR_CART = "CLEAR_CART",
  TICK = "TICK",

  TOOGLE_DRAWER = "TOOGLE_DRAWER",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  cart: CartRecord;
  lastItem: ItemIn | null;
  lastItemId: string;
  expired: boolean;
  clockOffset: number;
  drawerOpened: boolean;
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
      type: EE.CLEAR_CART;
    }
  | {
      type: EE.CLEAR_PRODUCT;
      payload: {
        item: ItemIn;
      };
    }
  | {
      type: EE.TICK;
    }
  | {
      type: EE.TOOGLE_DRAWER;
      payload: boolean;
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
      value: fse.clearing_product;
      context: MachineContextGenericI;
    }
  | {
      value: fse.cart_expired;
      context: MachineContextGenericI;
    }
  | {
      value: fse.clearing_cart;
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
      // TIME IN MINUTES
      // clockOffset: 60 * 8, // 8 hours
      // LOWER TIME FOR TESTING
      clockOffset: 2, // 2 mins

      drawerOpened: false,
    },
    // ---- EVENTS RECEVIED WHEN CURRENT FINITE STATE DOESN'T MATTER -----
    on: {
      [EE.TOOGLE_DRAWER]: {
        actions: [
          assign({
            drawerOpened: (ctx, e) => e.payload,
          }),
        ],
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
          [EE.TICK]: {
            actions: [
              assign({
                expired: (ctx, __) => {
                  return CartStore.timeExpired();
                },
              }),
            ],
            // GUARDED TRANSITION BECAUSE
            // TRANSITION WILL HAPPEN IF EXPIRATION HAPPEN
            cond: (ctx, ev) => {
              return ctx.expired;
            },
            target: fse.cart_expired,
          },
          [EE.ADD_ITEM]: {
            actions: [AA.EXPIRATION_MANIPULATION, AA.SET_LAST_ITEM],
            target: fse.adding_item,
          },
          [EE.REMOVE_ITEM]: {
            actions: [AA.EXPIRATION_MANIPULATION, AA.SET_LAST_ITEM],
            target: fse.removing_item,
          },
          [EE.CLEAR_PRODUCT]: {
            actions: [AA.EXPIRATION_MANIPULATION, AA.SET_LAST_ITEM],
            target: fse.clearing_product,
          },
          [EE.CLEAR_CART]: {
            actions: [AA.CLEAR_TIMER, AA.UNSET_LAST_ITEM],
            target: fse.clearing_cart,
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
                    product: updatedProduct,
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
              amount: 1,
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

                  let amount = 1;

                  if (cart[updatedProduct.productId]) {
                    amount = cart[updatedProduct.productId].amount - 1;
                  }

                  cart[updatedProduct.productId] = {
                    amount,
                    countInStock: updatedProduct.countInStock,
                    price: updatedProduct.price,
                    productId: updatedProduct.productId,
                    product: updatedProduct,
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
      [fse.clearing_product]: {
        //
        invoke: {
          id: "clear_product",
          src: (ctx, event) => {
            const { lastItemId, cart } = ctx;

            const { amount } = cart[lastItemId];

            return axios.put(`/api/cart/${lastItemId}`, {
              type: "clear-product",
              amount,
            });
          },
          onDone: {
            target: fse.idle,
            actions: [
              assign({
                cart: (ctx, ev) => {
                  const data = ev.data.data as Product;

                  const { cart } = ctx;

                  // delete cart[data.productId];
                  cart[data.productId] = {
                    amount: 0,
                    countInStock: data.countInStock,
                    productId: data.productId,
                    price: data.price,
                    product: data,
                  };

                  //

                  CartStore.clearProduct(data.productId);

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
      [fse.clearing_cart]: {
        //
        invoke: {
          id: "clear_cart",
          src: (ctx, event) => {
            const { cart } = ctx;

            return axios.put("/api/cart/clear-cart", cart);
          },
          onDone: {
            target: fse.idle,
            actions: [
              assign({
                cart: (_, ev) => {
                  console.log(ev.data.data);

                  CartStore.clearCart();
                  // THIS IS ONLY
                  // IF USER VIEWING PRODUCT THAT IS BEING CLEARED FROM CART
                  // TOGETHER WITH EVERY PRODUCT

                  const data = ev.data.data as Product[];

                  const cart: Record<string, ItemIn> = {};

                  for (let item of data) {
                    cart[item.productId] = {
                      amount: 0,
                      countInStock: item.countInStock,
                      price: item.price,
                      productId: item.productId,
                      product: item,
                    };
                  }

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
      [fse.cart_expired]: {
        // YOU NEED TO CLEAR CART AND CLEAR TIMER
        /* entry: [
          assign({
            cart: (ctx, ev) => {
              CartStore.clearTimer();

              return CartStore.clearCart();
            },
          }),
        ], */

        // TRANSITION
        /* after: {
          "1000": {
            target: fse.idle
          }
        } */

        always: {
          target: fse.clearing_cart,
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
    actions: {
      [AA.EXPIRATION_MANIPULATION]: (ctx, ev) => {
        CartStore.setExpirationTime(ctx.clockOffset);
      },
      [AA.CLEAR_TIMER]: (ctx, ev) => {
        CartStore.clearTimer();
      },
      [AA.SET_LAST_ITEM]: assign({
        lastItem: (_, ev) => {
          // PAYLOAD SHOUD BE HERE
          // @ts-ignore
          return ev.payload.item;
        },
        lastItemId: (_, ev) => {
          // PAYLOAD SHOUD BE HERE
          // @ts-ignore
          return ev.payload.item.productId;
        },
      }),
      [AA.UNSET_LAST_ITEM]: assign({
        lastItem: (_, ev) => {
          return null;
        },
        lastItemId: (_, ev) => {
          return "";
        },
      }),
    },
  }
);

export const cartService = interpret(cartMachine);

cartService.onTransition((state, event) => {
  //
  console.log(event.type);
  console.log(state.context.expired);
  console.log(state.context.cart);
  console.log("transition");
});
