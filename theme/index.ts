import { createTheme } from "@material-ui/core/styles";

import gray from "@material-ui/core/colors/grey";

import lime from "@material-ui/core/colors/lime";

enum colors_enum {
  dark_byzantium = "#542344",
  dark_purple = "#260f26",
  linen = "#efe6dd",
  nickel_grey = "#626c66",
  rifle_green = "#434a42",
}

const theme = createTheme({
  // I WON'T BE ADD ANYTHING
  // BUT YOU CAN EXTEND EVERYTHING
  //
  palette: {
    primary: {
      main: gray["600"],
    },
    secondary: {
      main: lime["200"],
    },
    background: {
      // default:
    },
  },
});

console.log({ theme });

export default theme;
