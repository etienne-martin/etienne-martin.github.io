import React, { FC } from "react";
import Head from "next/head";
import { Layout } from "../layout/layout.component";
import { Heading } from "../../catalog/heading/heading.component";

export const PageHome: FC = () => {
  return (
    <>
      <Head>
        <title>Etienne Martin, Web Architect</title>
      </Head>
      <Layout>
        <Heading component="h1">
          I make websites
          <br />
          go brrrrrr_
        </Heading>
      </Layout>
    </>
  );
};
