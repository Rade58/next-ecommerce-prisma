import { createMachine, assign, interpret } from "xstate";

/**
 * @description finite states enum
 */
export enum fse {
  idle = "idle",
  landed_on_shipping = "landed_on_shipping",
}

/**
 * @description EVENTS ENUM
 */
export enum EE {
  NAVIGATE_TO_SHIPPING = "NAVIGATE_TO_SHIPPING",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  random: number;
}

export type machineEventsGenericType = {
  type: EE.NAVIGATE_TO_SHIPPING;
  payload: {
    placeholder: number;
  };
};
/* | {
      type: EE.PLACEHOLDING_TWO;
      payload: {
        placeholder: string;
      };
    } */

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
    random: 2,
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
