import React, { FC } from "react";
import { Layout } from "../layout/layout.component";
import { Heading } from "../../catalog/heading/heading.component";

export const PageHome: FC = () => {
  return (
    <Layout>
      <Heading component="h1">
        I make computers
        <br />
        go brrrrrr_
      </Heading>
    </Layout>
  );
};
