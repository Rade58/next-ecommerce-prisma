import { createMachine, assign, interpret } from "xstate";

/**
 * @description finite states enum
 */
export enum fse {
  idle = "idle",
  nav_to_shipping = "nav_to_shipping",
}

/**
 * @description EVENTS ENUM
 */
export enum EE {
  PLACEHOLDING_ONE = "PLACEHOLDING_ONE",
}

// TO BE USED AS GENERIC TYPES INSIDE STATE MACHINE DEFINISTION

export interface MachineContextGenericI {
  random: number;
}

export type machineEventsGenericType = {
  type: EE.PLACEHOLDING_ONE;
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
      value: fse.nav_to_shipping;
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
    isDarkMode: false,
    random: 2,
  },
  // ---- EVENTS RECEVIED WHEN CURRENT FINITE STATE DOESN'T MATTER -----
  on: {
    [EE.CHECK_CURRENT_DARK_MODE]: {
      actions: [
        assign((ctx, event) => {
          const { isDark } = event.payload;

          return {
            isDarkMode: isDark,
          };
        }),
      ],
    },
  },
  // -------------------------------------------------------------------
  states: {
    [fse.idle]: {},
    [fse.non_idle]: {},
  },
});

export const shippingNavService = interpret(shippingNavMachine);

shippingNavService.onTransition((state, event) => {
  //
  console.log({ isDarkMode: state.context.isDarkMode });
  console.log("TRANSITION");
});
