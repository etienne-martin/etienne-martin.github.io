import React from "react";
import App from "next/app";
import { ThemeProvider } from "next-themes";

import "../style.css";
import { Layout } from "../modules/Layout/Layout";
import { MdxProvider } from "../modules/MdxProvider";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider defaultTheme="system">
        <MdxProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MdxProvider>
      </ThemeProvider>
    );
  }
}

export default MyApp;
