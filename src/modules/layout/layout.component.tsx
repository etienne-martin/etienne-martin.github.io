import React, { FC } from "react";
import styled from "styled-components";
import { Header } from "../header/header.component";
import { Footer } from "../footer/footer.component";

const StyledLayout = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 75px 100px;
`;

const Content = styled.main`
  flex-grow: 1;
  display: flex;
  align-items: center;
`;

export const Layout: FC = ({ children, ...otherProps }) => {
  return (
    <StyledLayout {...otherProps}>
      <Header />
      <Content>
        <div>{children}</div>
      </Content>
      <Footer />
    </StyledLayout>
  );
};
