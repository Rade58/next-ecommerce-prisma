import { createTheme } from "@material-ui/core/styles";

import gray from "@material-ui/core/colors/grey";

import lime from "@material-ui/core/colors/lime";

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
    background: {},
  },
});

console.log({ theme });

export default theme;
