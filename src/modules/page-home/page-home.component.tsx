import React, { FC } from "react";
import Head from "next/head";
import { MainLayout } from "../layout-main/layout-main.component";
import { Heading } from "../../catalog/heading/heading.component";
import { Text } from "../../catalog/text/text.component";

export const PageHome: FC = () => {
  return (
    <>
      <Head>
        <title>hello - etienne-martin</title>
      </Head>
      <MainLayout>
        <Heading component="h1" gutterBottom>
          Ethical browser fingerprinting
        </Heading>
        <Text component="p" variant="h4">
          Infrastructure as code for provisioning, compliance, and management of
          any cloud, infrastructure, and service. Secure your application while
          respecting user privacy.
        </Text>
      </MainLayout>
    </>
  );
};
