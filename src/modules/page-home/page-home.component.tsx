import React, { FC } from "react";
import { Layout } from "../layout/layout.component";
import { Heading } from "../../catalog/heading/heading.component";
import Head from "next/head";

export const PageHome: FC = () => {
  return (
    <>
      <Head>
        <title>Etienne Martin – Web Architect</title>
      </Head>
      <Layout>
        <Heading component="h1">
          I make computers
          <br />
          go brrrrrr_
        </Heading>
      </Layout>
    </>
  );
};
