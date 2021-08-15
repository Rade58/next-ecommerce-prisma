import { createTheme, makeStyles } from "@material-ui/core/styles";

import gray from "@material-ui/core/colors/grey";

import lime from "@material-ui/core/colors/lime";

enum colors_enum {
  dark_byzantium = "#542344",
  dark_purple = "#260f26",
  linen = "#f0eff4",
  nickel_grey = "#626c66",
  rifle_green = "#434a42",
}

const theme = createTheme({
  // I WON'T BE ADD ANYTHING
  // BUT YOU CAN EXTEND EVERYTHING
  //
  palette: {
    primary: {
      main: colors_enum.dark_purple,
    },
    secondary: {
      main: colors_enum.rifle_green,
    },
    background: {
      default: colors_enum.linen,
    },
  },
});

export const useAppBarStyles = makeStyles({
  butt: {
    //
  },
});

console.log({ theme });

export default theme;
