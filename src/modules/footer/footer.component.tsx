import React, { FC } from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  background: #000;
  padding: 0 30px;
  position: relative;
`;

export const Footer: FC = ({ ...otherProps }) => {
  return <StyledFooter {...otherProps}>footer</StyledFooter>;
};
