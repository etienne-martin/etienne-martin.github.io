import React, { FC } from "react";
import { ThemeProvider } from "next-themes";
import { MarkdownProvider } from "../MarkdownProvider";

export const Providers: FC = ({ children }) => {
  return (
    <ThemeProvider defaultTheme="system">
      <MarkdownProvider>{children}</MarkdownProvider>
    </ThemeProvider>
  );
};
