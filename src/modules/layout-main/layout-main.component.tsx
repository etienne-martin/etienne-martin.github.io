import React, { FC } from "react";
import styled from "styled-components";
import { Header } from "../header/header.component";
import { Footer } from "../footer/footer.component";

const StyledLayout = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
`;

const Content = styled.main`
  flex-grow: 1;
`;

export const MainLayout: FC = ({ children, ...otherProps }) => {
  return (
    <StyledLayout {...otherProps}>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </StyledLayout>
  );
};
