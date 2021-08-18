import { createTheme, makeStyles } from "@material-ui/core/styles";

import gray from "@material-ui/core/colors/grey";

import lime from "@material-ui/core/colors/lime";

enum colors_enum {
  xike_dark = "#04030F",
  tyrian_purple = "#5F1A37",
  linen = "#f0eff4",
  lavander = "#776885",
  olivine = "#AABD8C",
  tart_orange = "#F0544F",
  midnight_green = "#0F4C5C",
  beau_blue = "#B4D4EE",
}

const theme = createTheme({
  // I WON'T BE ADD ANYTHING
  // BUT YOU CAN EXTEND EVERYTHING
  //
  palette: {
    primary: {
      main: colors_enum.midnight_green,
    },
    secondary: {
      main: colors_enum.beau_blue,
    },
    background: {
      default: colors_enum.linen,
    },
    error: {
      main: colors_enum.tart_orange,
    },
    success: {
      main: colors_enum.olivine,
    },
    action: {
      active: colors_enum.lavander,
    },
  },
});

export const useAppBarStyles = makeStyles({
  butt: {
    marginLeft: "auto",
  },
});

console.log({ theme });

export default theme;
