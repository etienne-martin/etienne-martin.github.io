import React from "react";
import App from "next/app";

import "../style.css";
import { Layout } from "../modules/Layout/Layout";
import { Providers } from "../modules/Providers";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Providers>
    );
  }
}

export default MyApp;
