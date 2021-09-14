import { createMachine, assign, interpret } from "xstate";

/**
 * @description finite states enum
 */
export enum fse {
  mounted = "mounted",
  idle = "idle",
  landed_on_shipping = "landed_on_shipping",
  landed_on_signin_before_auth = "landed_on_signin_before_auth",
  landed_on_signin_after_auth = "landed_on_signin_after_auth",
}

/**
 * @description EVENTS ENUM
 */
export enum EE {
  NAVIGATE_TO_SHIPPING = "NAVIGATE_TO_SHIPPING",
  NAVIGATE_TO_SIGNIN_IN_CASE_SHIPPING_FAIL = "NAVIGATE_TO_SIGNIN_IN_CASE_SHIPPING_FAIL",
  // important (if dispatch this if you want to )
  // SET_INTENDED_FALSE = "SET_INTENDED_FALSE",
  //
  MARK_SIGNED_IN = "MARK_SIGNED_IN",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  // IF USER PRESED TO GO TO SHIPPING
  intended_to_go_to_shipping: boolean;
  //
  signed_in: boolean;
}

export type machineEventsGenericType =
  | {
      type: EE.NAVIGATE_TO_SHIPPING;
    }
  | {
      type: EE.NAVIGATE_TO_SIGNIN_IN_CASE_SHIPPING_FAIL;
    }
  /* | {
      type: EE.SET_INTENDED_FALSE;
    } */
  | {
      type: EE.MARK_SIGNED_IN;
      payload: boolean;
    };

export type machineFiniteStatesGenericType =
  | {
      value: fse.idle;
      context: MachineContextGenericI;
    }
  | {
      value: fse.landed_on_shipping;
      context: MachineContextGenericI;
    }
  | {
      value: fse.landed_on_signin_after_auth;
      context: MachineContextGenericI;
    }
  | {
      value: fse.landed_on_signin_before_auth;
      context: MachineContextGenericI;
    };

// -----------------  MACHINE --------------------

const shippingNavMachine = createMachine<
  MachineContextGenericI,
  machineEventsGenericType,
  machineFiniteStatesGenericType
>({
  id: "main_machine",
  initial: fse.mounted,
  context: {
    intended_to_go_to_shipping: false,
    signed_in: false,
  },
  // ---- EVENTS RECEVIED WHEN CURRENT FINITE STATE DOESN'T MATTER -----
  on: {
    //
  },
  // -------------------------------------------------------------------
  states: {
    [fse.idle]: {
      entry: [
        assign({
          intended_to_go_to_shipping: (c, e) => false,
        }),
      ],

      // NO TRANSITION HERE
      on: {
        [EE.MARK_SIGNED_IN]: {
          actions: [
            assign({
              signed_in: (ctx, ev) => {
                return ev.payload;
              },
            }),
          ],
        },
        //    ----    INTENDED TO TO SHIPPING

        [EE.NAVIGATE_TO_SHIPPING]: {
          actions: [
            assign({
              intended_to_go_to_shipping: (c, e) => true,
            }),
          ],
          cond: (ctx, ev) => {
            return ctx.signed_in;
          },

          target: fse.landed_on_shipping,
        },
        [EE.NAVIGATE_TO_SIGNIN_IN_CASE_SHIPPING_FAIL]: {
          target: fse.landed_on_signin_before_auth,
          actions: [
            assign({
              intended_to_go_to_shipping: (c, e) => true,
            }),
          ],
        },
      },
    },
    [fse.landed_on_shipping]: {
      always: {
        target: fse.idle,
      },
    },
    [fse.landed_on_signin_before_auth]: {
      // WAITING TO BE SIGNED IN
      on: {
        [EE.MARK_SIGNED_IN]: {
          actions: [
            assign({
              signed_in: (ctx, ev) => {
                return ev.payload;
              },
            }),
          ],

          cond: (ctx, e) => ctx.signed_in,

          target: fse.landed_on_signin_after_auth,
        },
      },
    },
    [fse.landed_on_signin_after_auth]: {
      // FROM HERE REDIRECTION SHOULD GO TO THE
      // SHIPPING PAGE
      always: {
        target: fse.landed_on_shipping,
      },
    },
  },
});

export const shippingNavService = interpret(shippingNavMachine);

shippingNavService.onTransition((state, event) => {
  //
  console.log({ ctx: state.context });
  console.log("TRANSITION");
});
