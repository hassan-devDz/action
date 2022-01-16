import CssBaseline from "@material-ui/core/CssBaseline";
import {
  jssPreset,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import App from "next/app";
import Error from "next/error";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import theme from "../Components/Theme";
import { useUser } from "../middleware/Hooks/fetcher";
import AppContext from "../middleware/appContext";
import "../styles/globals.css";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Layout from "../Components/Layout/index";

NProgress.configure({
  showSpinner: false,
  trickleRate: 0.1,
  trickleSpeed: 300,
});

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

Router.events.on("routeChangeError", () => {
  NProgress.done();
});

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

export default function MyApp({ Component, pageProps, user }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StylesProvider jss={jss}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppContext.Provider value={user}>
          {Component.auth ? (
            <Layout>
              <Auth>
                <Component {...pageProps} />
              </Auth>
            </Layout>
          ) : (
            <Component {...pageProps} />
          )}
        </AppContext.Provider>
      </StylesProvider>
    </ThemeProvider>
  );
}
MyApp.getInitialProps = async (appContext) => {
  //console.log(appContext);
  const appProps = await App.getInitialProps(appContext);

  const cookie = await appContext.ctx.req?.headers.cookie;
  const urlBass = await process.env.URL_BASE;
  let url;
  if (!appContext.ctx.req) {
    url = window.location.origin + "/api/authusers/user";
  } else {
    url = urlBass + "api/authusers/user";
  }

  const res = await fetch(url, {
    headers: {
      cookie: cookie,
    },
  });

  const data = await res.json();

  if (
    (await appContext.ctx.res?.statusCode) !== 404 &&
    (await appContext.ctx.res?.statusCode) !== 500
  ) {
    if (!appContext.Component.auth && !!data.user) {
      if (!appContext.ctx.req) {
        router.push("/");
      }
      if (appContext.ctx.req) {
        appContext.ctx.res.writeHead(302, { Location: "/" }).end();
      }
    }
    if (appContext.Component.auth && !data.user) {
      if (!appContext.ctx.req) {
        router.push("/auth/login");
      }
      if (appContext.ctx.req) {
        appContext.ctx.res.writeHead(302, { Location: "/auth/login" }).end();
      }
    }
  }

  return { ...appProps, ...data };
};
export function Auth({ children }) {
  const [user, { mutate, loading }] = useUser();

  const router = useRouter();
  const isUser = !!user;

  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) {
      router.push("/auth/login");
    } // If not authenticated, force log in
  }, [isUser, loading]);

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
