import "../styles/globals.css";
import Router from "next/router";
import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";

import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../Components/Theme";
import { create } from "jss";
import rtl from "jss-rtl";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { SessionProvider, useSession, signIn } from "next-auth/react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  const authComponent = ["SignIn", "verifyRequest", "error","resetpassword","NotFoundView"];
  const isAuthRequer = authComponent.includes(Component.name);
  console.log(Component.name);
  return (
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SessionProvider session={session}>
          {!isAuthRequer ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </SessionProvider>
      </StylesProvider>
    </ThemeProvider>
  );
}
function Auth({ children }) {
  const { data: session, status } = useSession();

  const isUser = !!session?.user;
  console.log(session, isUser);
  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) {
      Router.push("/auth/login");
    } // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <Backdrop open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
export default MyApp;
