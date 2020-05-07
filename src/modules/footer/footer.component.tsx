import React, { FC } from "react";
import styled from "styled-components";
import { Text } from "../../catalog/text/text.component";

const StyledFooter = styled.footer``;

export const Footer: FC = ({ ...otherProps }) => {
  return (
    <StyledFooter {...otherProps}>
      <Text component="p" variant="mono">
        <a
          href="https://www.npmjs.com/package/emartin"
          target="_blank"
          rel="noopener noreferrer"
        >
          npm install -g emartin
        </a>
      </Text>
    </StyledFooter>
  );
};
