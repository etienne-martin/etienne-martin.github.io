import React from "react";
import App from "next/app";

import "../style.css";
import { Layout } from "../modules/Layout/Layout";
import { ArticleLayout } from "../modules/ArticleLayout";
import { Providers } from "../modules/Providers";

class MyApp extends App {
  render() {
    const { Component, pageProps, router } = this.props;

    if (router.pathname.startsWith("/articles/")) {
      return (
        <Providers>
          <Layout>
            <ArticleLayout>
              <Component {...pageProps} />
            </ArticleLayout>
          </Layout>
        </Providers>
      );
    }

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
