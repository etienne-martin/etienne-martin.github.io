import React from "react";
import App from "next/app";

import "../modules/Theme/Theme.style";
import { Layout } from "../modules/Layout/Layout";
import { Providers } from "../modules/Providers";

export default class MyApp extends App {
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
