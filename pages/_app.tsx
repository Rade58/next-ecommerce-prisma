import "../styles/globals.css";
import { useEffect, Fragment } from "react";
import type { AppProps } from "next/app";

import { ThemeProvider, CssBaseline } from "@material-ui/core";

import theme from "../theme";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Fragment>
  );
}
export default MyApp;
