import React, { FC } from "react";
import Head from "next/head";
import { MainLayout } from "../layout-main/layout-main.component";
import { Heading } from "../../catalog/heading/heading.component";
import { Text } from "../../catalog/text/text.component";

export const PageHome: FC = () => {
  return (
    <>
      <Head>
        <title>hello world - etienne-martin</title>
      </Head>
      <MainLayout>
        <Heading component="h1" gutterBottom>
          Etienne Martin
        </Heading>
        <Text component="p" variant="h4">
          hello world
        </Text>
      </MainLayout>
    </>
  );
};
