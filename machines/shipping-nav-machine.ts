import { createMachine, assign, interpret } from "xstate";

/**
 * @description finite states enum
 */
export enum fse {
  idle = "idle",
  landed_on_shipping = "landed_on_shipping",
  signed_in = "signed_in",
  not_signed_in = "not_signed_in",
}

/**
 * @description EVENTS ENUM
 */
export enum EE {
  NAVIGATE_TO_SHIPPING = "NAVIGATE_TO_SHIPPING",
  SET_INTENDED_FALSE = "SET_INTENDED_FALSE",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  intended_to_go_to_shipping: boolean;
}

export type machineEventsGenericType =
  | {
      type: EE.NAVIGATE_TO_SHIPPING;
      payload: {
        placeholder: number;
      };
    }
  | {
      type: EE.SET_INTENDED_FALSE;
    };

export type machineFiniteStatesGenericType =
  | {
      value: fse.idle;
      context: MachineContextGenericI;
    }
  | {
      value: fse.landed_on_shipping;
      context: MachineContextGenericI;
    };

// -----------------  MACHINE --------------------

const shippingNavMachine = createMachine<
  MachineContextGenericI,
  machineEventsGenericType,
  machineFiniteStatesGenericType
>({
  id: "main_machine",
  initial: fse.idle,
  context: {
    intended_to_go_to_shipping: false,
  },
  // ---- EVENTS RECEVIED WHEN CURRENT FINITE STATE DOESN'T MATTER -----
  on: {
    //
  },
  // -------------------------------------------------------------------
  states: {
    [fse.idle]: {},
    [fse.landed_on_shipping]: {},
  },
});

export const shippingNavService = interpret(shippingNavMachine);

shippingNavService.onTransition((state, event) => {
  //
  console.log({ ctx: state.context });
  console.log("TRANSITION");
});
