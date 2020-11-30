import React, { FC, useEffect, useState } from "react";
import Head from "next/head";
import { Layout } from "../layout/layout.component";
import { Heading } from "../../catalog/heading/heading.component";

export const PageHome: FC = () => {
  const [shouldShowUnderscore, setShouldShowUnderscore] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldShowUnderscore(shouldShowUnderscore => !shouldShowUnderscore);
    }, 500);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Etienne Martin – Web Architect</title>
      </Head>
      <Layout>
        <Heading component="h1">
          I make computers
          <br />
          go brrrrrr{shouldShowUnderscore && "_"}
        </Heading>
      </Layout>
    </>
  );
};
