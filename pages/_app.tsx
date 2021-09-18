import { useEffect, Fragment } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";

import { useRouter } from "next/router";

import { ThemeProvider, CssBaseline } from "@material-ui/core";

import { Provider } from "next-auth/client";

// LETS IMPORT THIS
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
//

import theme from "../theme";

import Header from "../components/Header";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();

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
      <Provider session={pageProps.session}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Header />
          {/* WE ARE GOING TO WRAP PAGE COMPONENT IN
          MENTIONED PROVIDER LIKE THIS */}
          {/* <PayPalScriptProvider > */}
          <Component {...pageProps} />
          {/* </PayPalScriptProvider> */}
        </ThemeProvider>
      </Provider>
    </Fragment>
  );
}
export default MyApp;
