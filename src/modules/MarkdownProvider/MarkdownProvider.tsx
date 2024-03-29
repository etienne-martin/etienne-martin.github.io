import React, { FC } from "react";
import { MDXProvider } from "@mdx-js/react";
import { Heading } from "../../components/Heading";
import { Paragraph } from "../../components/Paragraph";
import { List } from "../../components/List";
import { ListItem } from "../../components/ListItem";
import { Code } from "../../components/Code";
import { InlineCode } from "../../components/InlineCode";
import { Image } from "../../components/Image";
import { Link } from "../../components/Link";
import { Divider } from "../../components/Divider";

const components = {
  h1: Heading.h1,
  h2: Heading.h2,
  h3: Heading.h3,
  h4: Heading.h4,
  h5: Heading.h5,
  h6: Heading.h6,
  hr: Divider,
  p: Paragraph,
  ul: List,
  ol: List,
  li: ListItem,
  code: Code,
  inlineCode: InlineCode,
  img: Image,
  a: Link,
  // Global react components
  Image,
};

export const MarkdownProvider: FC = ({ children }) => {
  return <MDXProvider components={components}>{children}</MDXProvider>;
};
