import { useEffect, Fragment } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { ThemeProvider, CssBaseline } from "@material-ui/core";

// IMPORTED PROVIDER
import { Provider } from "next-auth/client";

import theme from "../theme";

import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <Fragment>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* ADDED Provider */}
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
export default MyApp;
